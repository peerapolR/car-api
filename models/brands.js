const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    brand_name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "brands" }
);

const brand = mongoose.model("brand", schema);

module.exports = brand;
