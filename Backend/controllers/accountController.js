// controllers/accounts.controller.js
const QBOService = require('../services/qbo.Service');
const ChartOfAccounts = require('../models/ChartOfAccounts.model');

class AccountsController {
  static async syncAccounts(req, res) {
    try {
      const { access_token, realmId } = req.query;
      
      if (!access_token || !realmId) {
        return res.status(400).send('Missing access_token or realmId');
      }

      const accounts = await QBOService.fetchAccounts(access_token, realmId);
      
      for (const account of accounts) {
        await ChartOfAccounts.findOneAndUpdate(
          { Id: account.Id },
          account,
          { upsert: true, new: true }
        );
      }

      res.send(`Congratulations you successfully synced ${accounts.length} accounts to the MongoDB database`);
    } catch (error) {
      res.status(500).send('Error syncing accounts: ' + error.message);
    }
  }
}

module.exports = AccountsController;