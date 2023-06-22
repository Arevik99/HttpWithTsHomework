import http, { ServerResponse, IncomingMessage } from 'http';
import { Distributor } from './file-distributor';
import fs from 'fs';
import path from 'path';

http.createServer((req: IncomingMessage, res: ServerResponse) => { handleServerRequests(req, res) }).listen(8090);

function handleServerRequests(req: IncomingMessage, res: ServerResponse) {
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

function handlePostRequest(req: IncomingMessage, res: ServerResponse) {
  let directoryName: string;
  req.on('data', (chunk: string) => {
    directoryName = JSON.parse(chunk).csvPath;
  });

  req.on('end', () => {
    new Distributor().distributeTasks(directoryName).then(
      (result: number) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Data is converted and saved successfully!');
      }).catch((err) => {
        res.statusCode = 403;
        res.end('Bad Request!');
      });

  });
}

function handleDeleteRequest(req: IncomingMessage, res: ServerResponse) {
  const fileName = req.url && req.url.split('/').pop();
  const filePath = path.resolve(process.cwd(), 'Converted', fileName ? fileName : '');
  fs.unlink(filePath, (err: Error | null) => {
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

function handleGetByFileName(req: IncomingMessage, res: ServerResponse) {
  const fileName = req.url && req.url.split('/').pop();
  const filePath = path.resolve(process.cwd(), 'Converted', fileName ? fileName : '');
  fs.readFile(filePath, (err, data) => {
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

function handleGetRequest(req: IncomingMessage, res: ServerResponse) {
  let directoryPath = path.resolve(process.cwd(), 'Converted');
  fs.readdir(directoryPath, (err: Error | null, data: string[]) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found.');
    }
    else {
      res.end(data.toString());
    }
  });
}

function handleBadRequests(res: ServerResponse) {
  res.statusCode = 403;
  res.end('Bad Request!');
}