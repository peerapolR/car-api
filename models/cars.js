const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    brand_name: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
    },
    sub_model: {
      type: String,
      required: true,
    },
    start_production: {
      type: Number,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "cars" }
);

const car = mongoose.model("car", schema);

module.exports = car;
