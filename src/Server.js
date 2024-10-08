const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let users = {};

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Quando o usuário se conecta, adicionar à lista de usuários
  socket.on('join', (username) => {
    users[socket.id] = { username, vote: null };
    io.emit('users', users); // Envia a lista de usuários atualizada para todos
  });

  // Quando o usuário vota
  socket.on('vote', ({ userId, vote }) => {
    if (users[userId]) {
      users[userId].vote = vote;
    }
    io.emit('users', users); // Envia a lista de usuários atualizada para todos
  });

  // Quando o usuário revela os votos
  socket.on('revealVotes', () => {
    io.emit('revealVotes');
  });

  // Quando o usuário limpa os votos
  socket.on('clearVotes', () => {
    for (let user in users) {
      users[user].vote = null;
    }
    io.emit('clearVotes');
    io.emit('users', users); // Envia a lista de usuários atualizada para todos
  });

  // Quando o usuário se desconecta, remove-o da lista de usuários
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    delete users[socket.id];
    io.emit('users', users); // Envia a lista de usuários atualizada para todos
  });
});

server.listen(4000, () => {
  console.log('listening on *:4000');
});
