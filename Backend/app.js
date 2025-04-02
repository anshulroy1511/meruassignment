// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const accountRoutes = require('./routes/accounts.routes');
const payeeRoutes = require('./routes/payees.routes');
const transactionRoutes = require('./routes/transactions.routes');

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