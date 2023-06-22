import fs from 'fs';

export class JsonWritter {
    writeToJSONFile(filePath: string, data: string[]): Promise<number> {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, JSON.stringify(data), (error: Error | null) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data.length);
                }
            });
        });
    }
}
