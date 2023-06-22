"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvReader = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
class CsvReader {
    readCSVFile(filePath) {
        return new Promise((resolve, reject) => {
            const results = [];
            try {
                fs_1.default.createReadStream(filePath)
                    .on('error', (error) => reject(`Error while reading file: ${error}`))
                    .pipe((0, csv_parser_1.default)())
                    .on('data', (data) => results.push(data))
                    .on('end', () => resolve(results));
            }
            catch (error) {
                reject(`Error while creating the read stream: ${error}`);
            }
        });
    }
}
exports.CsvReader = CsvReader;
