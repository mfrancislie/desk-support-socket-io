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

// chat server
const httpServer = http.Server(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
const users = [];

io.on('connection', (socket) => {
  // when it close the web browser this function will run
  socket.on('disconnect', () => {
    const user = users.find((x) => x.socketId === socket.id);
    if (user) {
      user.online = false;
      const admin = users.find((x) => x.name === 'Admin' && x.online);
      if (admin) {
        io.to(admin.socketId).emit('updateUser', user);
      }
    }
  });

  //  It passes user as parameter to this function
  socket.on('onLogin', (user) => {
    const updatedUser = {
      ...user,
      online: true,
      socketId: socket.id,
      messages: [],
    };
    const existUser = users.find((x) => x.name === updatedUser.name);
    if (existUser) {
      existUser.socketId = socket.id;
      existUser.online = true;
    } else {
      users.push(updatedUser);
    }
    const admin = users.find((x) => x.name === 'Admin' && x.online);
    if (admin) {
      io.to(admin.socketId).emit('updateUser', updatedUser);
    }
    if (updatedUser.name === 'Admin') {
      io.to(updatedUser.socketId).emit('listUsers', users);
    }
  });

  // when admin click the user it emit this action to pass this selected user as parameter
  socket.on('onUserSelected', (user) => {
    const admin = users.find((x) => x.name === 'Admin' && x.online);
    if (admin) {
      const existUser = users.find((x) => x.name === user.name);
      io.to(admin.socketId).emit('selectUser', existUser);
    }
  });

  // when a user send a message to admin or admin send a message to user
  socket.on('onMessage', (message) => {
    console.log(message);
    if (message.from === 'Admin') {
      const user = users.find((x) => x.name === message.to && x.online);
      if (user) {
        io.to(user.socketId).emit('message', message);
        user.messages.push(message);
      } else {
        io.to(socket.id).emit('message', {
          from: 'System',
          to: 'Admin',
          body: 'User Is Not Online',
        });
      }
    } else {
      const admin = users.find((x) => x.name === 'Admin' && x.online);

      if (admin) {
        io.to(admin.socketId).emit('message', message);
        console.log(admin.socketId, message);
        const user = users.find((x) => x.name === message.from && x.online);
        if (user) {
          user.messages.push(message);
        }
      } else {
        io.to(socket.id).emit('message', {
          from: 'System',
          to: message.from,
          body: 'Sorry. Admin is not online right now',
        });
      }
    }
  });
});

const port = process.env.PORT || 5000;
httpServer.listen(port, () => console.log('serve http://localhost:5000'));
