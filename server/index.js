// WEB SOCKET is the solution for real time communication between client and server
// WEB SOCKET is a protocol that allows two-way communication between a client and a server.

// basic init server
const express = require('express');
const uniqid = require('uniqid');
const app = express();
const port = 3001;

// server listenning
const server = app.listen(port, () =>
  console.log(`app listening at http://localhost:${port}`)
);

// socket.io
const socketIO = require('socket.io');

// init socket.io
// allows client to connect to server and exchange messages
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

// init messages array where all messages will be stored
const messages = [
  // init first message from server
  { id: uniqid(), author: 'server', text: 'welcome to WildChat' },
];

// websocket connection event
io.on('connect', (socket) => {
  // log connection
  console.log('user connected');
  // send messages to client (emit)
  socket.emit('initialMessageList', messages);

  // receive message from client (on)
  socket.on('messageFromClient', (messageTextAndAuthor) => {
    // add message to messages array
    const newMessage = { id: uniqid(), ...messageTextAndAuthor };
    // log message
    console.log('new message from a client: ', newMessage);
    // add message to messages array
    messages.push(newMessage);
    // send message to client (emit)
    io.emit('messageFromServer', newMessage);
  });

  // disconnect event
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

