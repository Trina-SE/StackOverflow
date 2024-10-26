// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db'); // MongoDB connection file
const minioClient = require('./config/minio'); // MinIO configuration

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Adjust to match your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);

// Create HTTP Server and Socket.io for real-time notifications
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: 'http://localhost:3000' } });
app.set('io', io); // Make io accessible in other modules

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
