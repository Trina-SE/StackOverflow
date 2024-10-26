// server.js

require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const connectDB = require('./config/db'); // MongoDB connection file
const minioClient = require('./config/minio'); // MinIO configuration

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // To parse JSON request bodies

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable if the frontend needs to send cookies or headers
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Create HTTP Server and Socket.io for real-time notifications
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: 'http://localhost:3000' } });

app.set('io', io); // Make io accessible in other modules

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
