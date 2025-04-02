// controllers/transactions.controller.js
const QBOService = require('../services/qbo.Service');
const Transaction = require('../models/Transaction.model');
const mongoose = require('mongoose');

class TransactionsController {
  static async syncTransactions(req, res) {
    try {
      const { access_token, realmId } = req.query;
      
      if (!access_token || !realmId) {
        return res.status(400).send('Missing access_token or realmId');
      }

      // 1. Clean up potential index issues
      try {
        await Transaction.collection.dropIndex('id_1');
      } catch (error) {
        if (error.code !== 27) { // Ignore "Index not found" errors
          console.warn('Error dropping index:', error.message);
        }
      }

      // 2. Fetch data from QBO
      const [purchases, deposits] = await Promise.all([
        QBOService.fetchUncategorizedPurchases(access_token, realmId),
        QBOService.fetchUncategorizedDeposits(access_token, realmId)
      ]);

      // 3. Process with enhanced error handling
      const processBatch = async (items, type) => {
        const results = [];
        for (const item of items) {
          try {
            // Ensure Id exists and is valid
            if (!item.Id) {
              console.warn(`Missing Id for ${type}, generating one`);
              item.Id = new mongoose.Types.ObjectId().toString();
            }

            const result = await Transaction.findOneAndUpdate(
              { Id: item.Id },
              { 
                ...item, 
                Type: type,
                isCategorized: false,
                // Ensure critical fields exist
                TxnDate: item.TxnDate || new Date(),
                TotalAmt: item.TotalAmt || 0
              },
              { 
                upsert: true, 
                new: true,
                setDefaultsOnInsert: true 
              }
            );
            results.push(result);
          } catch (itemError) {
            console.error(`Error processing ${type} ${item.Id || 'unknown'}:`, itemError.message);
          }
        }
        return results;
      };

      // 4. Process in parallel with error isolation
      const [processedPurchases, processedDeposits] = await Promise.all([
        processBatch(purchases, 'PURCHASE'),
        processBatch(deposits, 'DEPOSIT')
      ]);

      // 5. Return results
      const successCount = processedPurchases.length + processedDeposits.length;
      const skippedCount = (purchases.length + deposits.length) - successCount;
      
      let message = ` Congratulations you Successfully synced ${successCount} transactions ` +
                   `(${processedPurchases.length} purchases, ${processedDeposits.length} deposits)`;
      
      if (skippedCount > 0) {
        message += ` (${skippedCount} items skipped due to errors)`;
      }

      res.send(message);
    } catch (error) {
      console.error('Sync transactions failed:', error);
      res.status(500).send('Error syncing transactions: ' + error.message);
    }
  }
}

module.exports = TransactionsController;