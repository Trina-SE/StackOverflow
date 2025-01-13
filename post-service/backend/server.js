require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = 4001;

connectDB();

app.use(express.json());
app.use('/api/posts', postRoutes);

app.listen(PORT, () => console.log(`Post Service running on port ${PORT}`));
