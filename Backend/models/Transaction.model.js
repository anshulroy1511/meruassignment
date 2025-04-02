// models/Transaction.model.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  Id: {
    type: String,
    required: true,
    unique: true,
  },
  TxnDate: Date,
  Type: { type: String, enum: ["PURCHASE", "DEPOSIT"] },
  TotalAmt: Number,
  PaymentType: String,
  AccountRef: Object,
  EntityRef: Object,
  Line: Array,
  PrivateNote: String,
  SyncToken: String,
  MetaData: Object,
  qboLastUpdated: { type: Date, default: Date.now },
  // Additional fields to track categorization status
  isCategorized: { type: Boolean, default: false },
},
{
    autoIndex: true
});

transactionSchema.index({ Id: 1 }, { unique: true });

module.exports = mongoose.model(
  "Transaction",
  transactionSchema,
  "transactions"
);
