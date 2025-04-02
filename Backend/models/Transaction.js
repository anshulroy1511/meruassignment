const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['purchase', 'deposit'] },
  date: Date,
  amount: Number,
  uncategorized: { type: Boolean, default: true },
  payeeRef: {
    id: String,
    name: String
  },
  accountRef: {
    id: String,
    name: String
  },
  lineItems: [{
    description: String,
    amount: Number,
    accountRef: {
      id: String,
      name: String
    }
  }],
  metaData: {
    createTime: Date,
    lastUpdatedTime: Date
  },
  qboSyncToken: String,
  lastSynced: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);