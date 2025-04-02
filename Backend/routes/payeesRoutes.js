// routes/payees.routes.js
const express = require('express');
const router = express.Router();
const PayeesController = require('../controllers/payeesController');

router.get('/sync/payees', PayeesController.syncPayees);

module.exports = router;