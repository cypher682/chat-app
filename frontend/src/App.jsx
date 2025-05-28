import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// Connect to backend (use localhost for now, update later for deployment)
const socket = io('http://localhost:5000');

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    socket.on('load messages', (existingMessages) => {
      setMessages(existingMessages);
    });

    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('load messages');
      socket.off('chat message');
    };
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsJoined(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', { username, text: message });
      setMessage('');
    }
  };

  return (
    <div className="App">
      {!isJoined ? (
        <div className="join-container">
          <h2>Join Chat</h2>
          <form onSubmit={handleJoin}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit">Join</button>
          </form>
        </div>
      ) : (
        <div className="chat-container">
          <h2>Chat Room</h2>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <strong>{msg.username}</strong>: {msg.text}{' '}
                <span>({new Date(msg.timestamp).toLocaleTimeString()})</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;