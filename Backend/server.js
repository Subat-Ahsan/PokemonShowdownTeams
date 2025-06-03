const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const userRoutes = require('./Routes/auth');
const dataRoutes = require('./Routes/data');

app.use('/users', userRoutes);
app.use('/data', dataRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});