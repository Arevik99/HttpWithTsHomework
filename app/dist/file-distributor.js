"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Distributor = void 0;
const helper_1 = require("./helper");
const worker_threads_1 = require("worker_threads");
class Distributor {
    distributeTasks(directoryName) {
        return new Promise((resolve, reject) => {
            let csvFilesList = new helper_1.Helper(directoryName.toString()).getCsvFilePaths();
            let threadsArray = [];
            for (let i = 0; i < 10; i++) {
                let worker = new worker_threads_1.Worker('./worker.js');
                threadsArray.push(worker);
                worker.on('online', () => {
                    worker.postMessage({ taskIndex: i, filePath: csvFilesList[i] });
                });
            }
            let numOfAllrecords = 0;
            let currentTaskIndex = 0;
            let terminatedCount = 0;
            threadsArray.forEach((worker) => {
                worker.on('message', (message) => {
                    currentTaskIndex++;
                    numOfAllrecords += message.numOfRecords;
                    if (currentTaskIndex < csvFilesList.length) {
                        worker.postMessage({ taskIndex: currentTaskIndex, filePath: csvFilesList[currentTaskIndex] });
                    }
                    else {
                        terminatedCount++;
                        worker.terminate();
                    }
                });
                worker.on('error', (error) => reject(`Error while workingwith threads: ${error}`));
                worker.on('exit', (code) => {
                    if (terminatedCount === csvFilesList.length) {
                        resolve(numOfAllrecords);
                    }
                });
            });
        });
    }
}
exports.Distributor = Distributor;
