// controllers/auth.controller.js
const axios = require('axios');
const qs = require('qs');
const {
  QB_CLIENT_ID,
  QB_CLIENT_SECRET,
  QB_REDIRECT_URI,
  QB_AUTH_URL,
  QB_TOKEN_URL
} = require('../config/qbo.config');

class AuthController {
  static initiateAuth(req, res) {
    const authUrl = `${QB_AUTH_URL}?client_id=${QB_CLIENT_ID}&redirect_uri=${QB_REDIRECT_URI}&response_type=code&scope=com.intuit.quickbooks.accounting&state=testState`;
    res.redirect(authUrl);
  }

  static async handleCallback(req, res) {
    try {
      const { code,realmId } = req.query;
      
      const tokenResponse = await axios.post(
        QB_TOKEN_URL,
        qs.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: QB_REDIRECT_URI
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${QB_CLIENT_ID}:${QB_CLIENT_SECRET}`).toString('base64')}`
          }
        }
      );

      const { access_token, refresh_token } = tokenResponse.data;
      
      // In a real app, store these tokens securely
      console.log('Access Token:', access_token);
      console.log('Refresh Token:', refresh_token);
      console.log('Company ID (realmId):', realmId);
      
      res.send(`Authentication successful! Tokens and realmId (${realmId}) logged to console.`);
    } catch (error) {
      console.error('Auth error:', error.response ? error.response.data : error.message);
      res.status(500).send('Authentication failed');
    }
  }
}

module.exports = AuthController;