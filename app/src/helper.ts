import path from 'path';
import fs from 'fs';

export class Helper {
    public csvFilesList: string[] = [];
    constructor(public directoryPath: string) {
    }
    public getCsvFilePaths(): string[] {
        fs.readdir(this.directoryPath, (err: Error | null, files: string[]) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }
            else {
                files.forEach((file) => {
                    if (path.extname(file) === '.csv') {
                        const filePath = path.resolve(this.directoryPath, file)
                        this.csvFilesList.push(filePath);
                    }
                });
            }
        });
        return this.csvFilesList;
    }
}