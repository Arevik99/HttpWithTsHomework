import { parentPort } from 'worker_threads';
import { JsonWritter } from './json-writter';
import { CsvReader } from './csv-reader';
import path from 'path';

parentPort && parentPort.on('message', (message:Task) => {
  if (message.taskIndex && message.filePath) {
    const taskIndex = message.taskIndex;
    const filePath = message.filePath;
    new CsvReader().readCSVFile(filePath).then(
      (data:string[]) => {
        const jsonFilePath = path.join('./Converted', path.parse(filePath).name);
        return new JsonWritter().writeToJSONFile(`${jsonFilePath}.json`, data);
      },
      (err:Error) => {
        throw new Error(`Error while reading file: ${err}`);
      }).then((numOfRecords:number) => {
        parentPort && parentPort.postMessage({ event: 'taskCompleted', taskIndex, numOfRecords });
      }, (err:Error) => {
        parentPort && parentPort.postMessage(`Error while writting file: ${err}`)
      });
  }
});


