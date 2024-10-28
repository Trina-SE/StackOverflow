require('dotenv').config();
console.log("Loaded Environment Variables:", process.env); // Add this line for debugging

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const minioClient = require('./config/minio');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Confirm necessary environment variables are loaded
if (!process.env.MINIO_ENDPOINT || !process.env.MINIO_BUCKET || !process.env.MONGO_URI) {
  console.error("Missing required environment variables. Ensure .env is properly configured.");
  process.exit(1);
}

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: 'http://localhost:3000' } });

app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack || err);
  res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
