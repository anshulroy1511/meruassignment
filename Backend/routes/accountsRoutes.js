// routes/accounts.routes.js
const express = require('express');
const router = express.Router();
const AccountsController = require('../controllers/accountController');

router.get('/sync/accounts', AccountsController.syncAccounts);

module.exports = router;