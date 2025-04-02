// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountsRoutes');
const payeeRoutes = require('./routes/payeesRoutes');
const transactionRoutes = require('./routes/transactionsRoutes');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/', authRoutes);
app.use('/', accountRoutes);
app.use('/', payeeRoutes);
app.use('/', transactionRoutes);

module.exports = app;