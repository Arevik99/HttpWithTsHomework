"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonWritter = void 0;
const fs_1 = __importDefault(require("fs"));
class JsonWritter {
    writeToJSONFile(filePath, data) {
        return new Promise((resolve, reject) => {
            fs_1.default.writeFile(filePath, JSON.stringify(data), (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(data.length);
                }
            });
        });
    }
}
exports.JsonWritter = JsonWritter;
