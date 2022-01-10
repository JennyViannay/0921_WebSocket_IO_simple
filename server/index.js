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

// [step1] - add socket.io to the project (npm install --save socket.io-client)
const socketIO = require('socket.io');

// [step2] - init socket.io
// allows client to connect to server and exchange messages
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

// [step3] - init messages array where all messages will be stored
// messages array will be updated when new message is received
// we can use this array to display all messages in the chat
// we can also use mysql or mongoDB to store messages
const messages = [
  // init first message from server
  { id: uniqid(), author: 'server', text: 'welcome to WildChat' },
];

// [step4] - websocket connection event
// when client connects to server
// we can use socket.id to identify each messages from client
// we can use socket.emit to send messages to client
io.on('connect', (socket) => {
  // log connection
  console.log('user connected');
  // send messages to client (emit)
  socket.emit('initialMessageList', messages);

  // receive message from client (on)
  // messageFromClient event is emitted by client
  socket.on('messageFromClient', (messageTextAndAuthor) => {
    // add message to messages array
    const newMessage = { id: uniqid(), ...messageTextAndAuthor };
    // log new message from client
    console.log('new message from a client: ', newMessage);
    // add new message to messages array
    messages.push(newMessage);
    // resend this message to the client (emit)
    io.emit('messageFromServer', newMessage);
  });

  // [step5] - disconnect event
  // when client disconnects from server
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

