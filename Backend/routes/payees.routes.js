// routes/payees.routes.js
const express = require('express');
const router = express.Router();
const PayeesController = require('../controllers/payees.controller');

router.get('/sync/payees', PayeesController.syncPayees);

module.exports = router;