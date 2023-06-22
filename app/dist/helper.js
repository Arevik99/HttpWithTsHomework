"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class Helper {
    constructor(directoryPath) {
        this.directoryPath = directoryPath;
        this.csvFilesList = [];
    }
    getCsvFilePaths() {
        fs_1.default.readdir(this.directoryPath, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }
            else {
                files.forEach((file) => {
                    if (path_1.default.extname(file) === '.csv') {
                        const filePath = path_1.default.resolve(this.directoryPath, file);
                        this.csvFilesList.push(filePath);
                    }
                });
            }
        });
        return this.csvFilesList;
    }
}
exports.Helper = Helper;
