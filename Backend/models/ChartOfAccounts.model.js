// models/ChartOfAccounts.model.js
const mongoose = require('mongoose');

const chartOfAccountsSchema = new mongoose.Schema({
  Id: String,
  Name: String,
  AccountType: String,
  AccountSubType: String,
  Classification: String,
  FullyQualifiedName: String,
  Active: Boolean,
  CurrencyRef: Object,
  syncToken: String,
  MetaData: Object,
  qboLastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChartOfAccounts', chartOfAccountsSchema, 'chartOfAccounts');