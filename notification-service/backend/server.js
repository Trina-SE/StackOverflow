require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = 4002;

connectDB();

app.use(express.json());
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => console.log(`Notification Service running on port ${PORT}`));
