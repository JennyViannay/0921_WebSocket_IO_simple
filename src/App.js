import React, { useEffect, useState } from 'react';
// [step6] - add socket.io to the client
import socketIOClient from 'socket.io-client';

function App() {
  // [step7] : 
  // init messages array where all messages will be stored
  // messages array will be updated when new message is received
  const [messageList, setMessageList] = useState([]);
  // [step8] - state for new message (author + message text) from client
  const [nickName, setNickName] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  // [step9] - state for socket
  const [socket, setSocket] = useState(null);

  // [step10] - useEffect hook to connect to server
  useEffect(() => {
    // connect to server with socket.io
    const socket = socketIOClient('http://localhost:3001');
    // set socket state
    setSocket(socket);
    // get initial messages from server and set messageList
    socket.on('initialMessageList', (messages) => {
      setMessageList(messages);
    });
    // listen to new message event and set messageList
    socket.on('messageFromServer', (newMessage) =>
      setMessageList((messageList) => [...messageList, newMessage])
    );
    // return function to unmount / disconnect from server
    return () => socket.disconnect();
  }, []);

  // [step11] - send message to server (emit methode from socket)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessageText && nickName) {
      socket.emit('messageFromClient', {
        text: newMessageText,
        author: nickName,
      });
    }
  };

  return (
    <div className='App'>
      <h2>Messages</h2>
      {messageList.map((message) => {
        return (
          <div key={message.id}>
            {message.author} : {message.text}
          </div>
        );
      })}

      <form onSubmit={handleSubmit}>
        <h2>New Message</h2>
        <input
          type='text'
          name='author'
          placeholder='nickname'
          value={nickName}
          required
          onChange={(e) => setNickName(e.target.value)}
        />
        <input
          type='text'
          name='messageContent'
          placeholder='message'
          value={newMessageText}
          required
          onChange={(e) => setNewMessageText(e.target.value)}
        />
        <input
          type='submit'
          disabled={!nickName || !newMessageText}
          onClick={handleSubmit}
          value='send'
        />
      </form>
    </div>
  );
}

export default App;
