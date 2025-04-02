// models/Payee.model.js
const mongoose = require('mongoose');

const payeeSchema = new mongoose.Schema({
  Id: String, // QBO ID
  DisplayName: String,
  Type: { type: String, enum: ['VENDOR', 'CUSTOMER'] },
  Active: Boolean,
  Balance: Number,
  PrimaryEmailAddr: Object,
  PrimaryPhone: Object,
  MetaData: Object,
  SyncToken: String,
  qboLastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payee', payeeSchema, 'payees');