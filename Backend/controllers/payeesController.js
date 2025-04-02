// controllers/payees.controller.js
const QBOService = require('../services/qbo.Service');
const Payee = require('../models/Payee.model');
const mongoose = require('mongoose');

class PayeesController {
  static async syncPayees(req, res) {
    try {
      const { access_token, realmId } = req.query;
      
      if (!access_token || !realmId) {
        return res.status(400).send('Missing access_token or realmId');
      }

      // 1. Clean up potential index issues
      try {
        await Payee.collection.dropIndex('id_1');
      } catch (error) {
        if (error.code !== 27) { // Ignore "Index not found" errors
          console.warn('Error dropping index:', error.message);
        }
      }

      // 2. Fetch data from QBO
      const [vendors, customers] = await Promise.all([
        QBOService.fetchVendors(access_token, realmId),
        QBOService.fetchCustomers(access_token, realmId)
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

            const result = await Payee.findOneAndUpdate(
              { Id: item.Id },
              { 
                ...item, 
                Type: type,
                // Ensure critical fields exist
                DisplayName: item.DisplayName || 'Unknown',
                Active: item.Active !== undefined ? item.Active : true
              },
              { 
                upsert: true, 
                new: true,
                // Handle potential duplicate key errors
                setDefaultsOnInsert: true 
              }
            );
            results.push(result);
          } catch (itemError) {
            console.error(`Error processing ${type} ${item.Id}:`, itemError.message);
          }
        }
        return results;
      };

      // 4. Process in parallel with error isolation
      const [processedVendors, processedCustomers] = await Promise.all([
        processBatch(vendors, 'VENDOR'),
        processBatch(customers, 'CUSTOMER')
      ]);

      // 5. Return results
      const successCount = processedVendors.length + processedCustomers.length;
      const skippedCount = (vendors.length + customers.length) - successCount;
      
      let message = ` Congratulations you Successfully synced ${successCount} payees ` +
                   `(${processedVendors.length} vendors, ${processedCustomers.length} customers)`;
      
      if (skippedCount > 0) {
        message += ` (${skippedCount} items skipped due to errors)`;
      }

      res.send(message);
    } catch (error) {
      console.error('Sync payees failed:', error);
      res.status(500).send('Error syncing payees: ' + error.message);
    }
  }
}

module.exports = PayeesController;