const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for development (restrict in production)
    methods: ['GET', 'POST'],
  },
});

// Store messages in memory (array)
let messages = [];

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send existing messages to the new user
  socket.emit('load messages', messages);

  // Handle incoming messages
  socket.on('chat message', (data) => {
    const message = {
      username: data.username,
      text: data.text,
      timestamp: new Date().toISOString(),
    };
    messages.push(message);
    io.emit('chat message', message); // Broadcast to all users
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve a simple endpoint
app.get('/', (req, res) => {
  res.send('Chat server is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});