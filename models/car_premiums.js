const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    car_type: {
      type: Number,
      required: true,
      trim: true,
    },
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
    company_name: {
      type: String,
      required: true,
      trim: true,
    },
    premium_name: {
      type: String,
      required: true,
      trim: true,
    },
    insurance_type: {
      type: String,
      required: true,
      enum: ["1", "2", "3", "2+", "3+"],
    },
    responsibility_body_person: {
      type: Number,
    },
    responsibility_body_times: {
      type: Number,
    },
    responsibility_asset: {
      type: Number,
    },
    // car_damage: {
    //   type: Number,
    // },
    first_damage: {
      type: Number,
    },
    // car_lost_fire: {
    //   type: Number,
    // },
    personal_accident: {
      type: Number,
    },
    personal_accident_number: {
      type: Number,
    },
    medical: {
      type: Number,
    },
    medical_number: {
      type: Number,
    },
    criminal_driver: {
      type: Number,
    },
    insurance_premium_type: {
      type: String,
    },
    insurance_premium_condition: {
      type: String,
    },
    sum_insured_min: {
      type: Number,
    },
    sum_insured_max: {
      type: Number,
    },
    car_age_min: {
      type: Number,
    },
    car_age_max: {
      type: Number,
    },
    fund_regis_bkk: {
      type: Number,
    },
    fund_regis_up_country: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "car_premiums" }
);

const car_premium = mongoose.model("car_premium", schema);

module.exports = car_premium;
