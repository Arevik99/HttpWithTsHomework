"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const file_distributor_1 = require("./file-distributor");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
http_1.default.createServer((req, res) => { handleServerRequests(req, res); }).listen(8090);
function handleServerRequests(req, res) {
    if (req.method === 'POST') {
        if (req.url === '/exports') {
            handlePostRequest(req, res);
        }
        else {
            handleBadRequests(res);
        }
    }
    if (req.method === 'DELETE') {
        if (req.url && req.url.startsWith('/files/')) {
            handleDeleteRequest(req, res);
        }
        else {
            handleBadRequests(res);
        }
    }
    if (req.method === 'GET') {
        if (req.url === '/files') {
            handleGetRequest(req, res);
        }
        else {
            if (req.url && req.url.startsWith('/files/')) {
                handleGetByFileName(req, res);
            }
            else {
                handleBadRequests(res);
            }
        }
    }
}
function handlePostRequest(req, res) {
    let directoryName;
    req.on('data', (chunk) => {
        directoryName = JSON.parse(chunk).csvPath;
    });
    req.on('end', () => {
        new file_distributor_1.Distributor().distributeTasks(directoryName).then((result) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Data is converted and saved successfully!');
        }).catch((err) => {
            res.statusCode = 403;
            res.end('Bad Request!');
        });
    });
}
function handleDeleteRequest(req, res) {
    const fileName = req.url && req.url.split('/').pop();
    const filePath = path_1.default.resolve(process.cwd(), 'Converted', fileName ? fileName : '');
    fs_1.default.unlink(filePath, (err) => {
        if (err) {
            res.statusCode = 404;
            res.end('File not found.');
        }
        else {
            res.statusCode = 200;
            res.end('Successfully deleted!');
        }
    });
}
function handleGetByFileName(req, res) {
    const fileName = req.url && req.url.split('/').pop();
    const filePath = path_1.default.resolve(process.cwd(), 'Converted', fileName ? fileName : '');
    fs_1.default.readFile(filePath, (err, data) => {
        if (err) {
            res.statusCode = 404;
            res.end('File not found.');
            return;
        }
        else {
            res.statusCode = 200;
            res.end(data.toString());
        }
    });
}
function handleGetRequest(req, res) {
    let directoryPath = path_1.default.resolve(process.cwd(), 'Converted');
    fs_1.default.readdir(directoryPath, (err, data) => {
        if (err) {
            res.statusCode = 404;
            res.end('File not found.');
        }
        else {
            res.end(data.toString());
        }
    });
}
function handleBadRequests(res) {
    res.statusCode = 403;
    res.end('Bad Request!');
}
