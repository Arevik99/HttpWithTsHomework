import { Helper } from './helper';
import { Worker } from 'worker_threads';

export class Distributor {
  distributeTasks(directoryName: string): Promise<number> {
    return new Promise((resolve, reject) => {

      let csvFilesList = new Helper(directoryName.toString()).getCsvFilePaths();
      let threadsArray: Worker[] = [];
      for (let i = 0; i < 10; i++) {
        let worker = new Worker('./worker.js');
        threadsArray.push(worker);
        worker.on('online', () => {
          worker.postMessage({ taskIndex: i, filePath: csvFilesList[i] });
        });
      }
      let numOfAllrecords = 0;
      let currentTaskIndex = 0;
      let terminatedCount = 0;
      threadsArray.forEach((worker) => {
        worker.on('message', (message: Task) => {
          currentTaskIndex++;
          numOfAllrecords += message.numOfRecords;
          if (currentTaskIndex < csvFilesList.length) {
            worker.postMessage({ taskIndex: currentTaskIndex, filePath: csvFilesList[currentTaskIndex] });
          } else {
            terminatedCount++;
            worker.terminate();
          }
        });
        worker.on('error', (error: Error) => reject(`Error while workingwith threads: ${error}`));
        worker.on('exit', (code: number) => {
          if (terminatedCount === csvFilesList.length) {
            resolve(numOfAllrecords);
          }
        });
      });
    });
  }
}