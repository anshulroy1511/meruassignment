// routes/transactions.routes.js
const express = require('express');
const router = express.Router();
const TransactionsController = require('../controllers/transactions.controller');

router.get('/sync/transactions', TransactionsController.syncTransactions);

module.exports = router;