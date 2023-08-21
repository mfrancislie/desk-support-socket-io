import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';

const app = express();

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

const httpServer = http.Server(app);

const port = process.env.PORT || 5000;
httpServer.listen(port, () => console.log('serve http://localhost:5000'));
