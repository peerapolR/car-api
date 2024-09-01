const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    car_code: {
      type: String,
      required: true,
      trim: true,
    },
    car_type: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "car_types" }
);

const car_type = mongoose.model("car_type", schema);

module.exports = car_type;
