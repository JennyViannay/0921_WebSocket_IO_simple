import React, { useEffect, useState } from 'react';
// add socket.io to the project
import socketIOClient from 'socket.io-client';

function App() {
  // state for messages
  const [messageList, setMessageList] = useState([]);
  // state for new message (author + message text)
  const [nickName, setNickName] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  // state for socket
  const [socket, setSocket] = useState(null);

  // when component mounts
  useEffect(() => {
    // connect to server with socket.io
    const socket = socketIOClient('http://localhost:3001');
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

  // send message to server (emit)
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
