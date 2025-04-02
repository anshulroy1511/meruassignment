// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.get('/auth/qbo', AuthController.initiateAuth);
router.get('/callback', AuthController.handleCallback);

module.exports = router;