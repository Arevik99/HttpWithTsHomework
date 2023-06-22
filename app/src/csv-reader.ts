import fs from 'fs';
import csv from 'csv-parser';

export class CsvReader {
    readCSVFile(filePath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const results: string[] = [];
            try {
                fs.createReadStream(filePath)
                    .on('error', (error: Error) => reject(`Error while reading file: ${error}`))
                    .pipe(csv())
                    .on('data', (data: string) => results.push(data))
                    .on('end', () => resolve(results));
            }
            catch (error) {
                reject(`Error while creating the read stream: ${error}`);
            }
        });
    }
}