const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
    },
    customer_tel: {
      type: String,
    },
    customer_email: {
      type: String,
    },
    customer_address: {
      type: String,
    },
    discount_percent: { type: String },
    discount_baht: { type: String },
    premium_1: {
      type: Schema.Types.Mixed,
    },
    premium_2: {
      type: Schema.Types.Mixed,
    },
    premium_3: {
      type: Schema.Types.Mixed,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "transactions" }
);

const transaction = mongoose.model("transaction", schema);

module.exports = transaction;
