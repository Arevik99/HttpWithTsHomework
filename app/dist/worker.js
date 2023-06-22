"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const json_writter_1 = require("./json-writter");
const csv_reader_1 = require("./csv-reader");
const path_1 = __importDefault(require("path"));
worker_threads_1.parentPort && worker_threads_1.parentPort.on('message', (message) => {
    if (message.taskIndex && message.filePath) {
        const taskIndex = message.taskIndex;
        const filePath = message.filePath;
        new csv_reader_1.CsvReader().readCSVFile(filePath).then((data) => {
            const jsonFilePath = path_1.default.join('./Converted', path_1.default.parse(filePath).name);
            return new json_writter_1.JsonWritter().writeToJSONFile(`${jsonFilePath}.json`, data);
        }, (err) => {
            throw new Error(`Error while reading file: ${err}`);
        }).then((numOfRecords) => {
            worker_threads_1.parentPort && worker_threads_1.parentPort.postMessage({ event: 'taskCompleted', taskIndex, numOfRecords });
        }, (err) => {
            worker_threads_1.parentPort && worker_threads_1.parentPort.postMessage(`Error while writting file: ${err}`);
        });
    }
});
