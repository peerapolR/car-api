const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Brands = require("../models/brands");
const Cars = require("../models/cars");
const CarPremiums = require("../models/car_premiums");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
// const s3url = require("../utils/content");
// const logger = require("../utils/logger");

exports.addPremiums = async (req, res, next) => {
  try {
    const {
      car_type,
      brand_name,
      model,
      sub_model,
      company_name,
      premium_name,
      insurance_type,
      responsibility_body_person,
      responsibility_body_times,
      responsibility_asset,
      // car_damage,
      first_damage,
      // car_lost_fire,
      personal_accident,
      personal_accident_number,
      medical,
      medical_number,
      criminal_driver,
      insurance_premium_type,
      insurance_premium_condition,
      sum_insured_min,
      sum_insured_max,
      car_age_min,
      car_age_max,
      fund_regis_bkk,
      fund_regis_up_country,
    } = req.body;

    const existBrand = await Brands.findOne({
      brand_name: brand_name.toLowerCase(),
    });
    if (!existBrand) {
      const error = new Error("ไม่พบ Brand กรุณาสร้าง Brand ก่อนทำรายการ");
      error.statusCode = 404;
      throw error;
    }

    const existCar = await Cars.findOne({
      brand_name: brand_name.toLowerCase(),
      model: model.toLowerCase(),
    });

    if (!existCar) {
      const error = new Error(
        "ไม่พบ model รถยนต์กรุณาสร้าง Model ก่อนทำรายการ"
      );
      error.statusCode = 404;
      throw error;
    }

    let newPremium = new CarPremiums({
      car_type: car_type,
      brand_name: brand_name.toLowerCase(),
      model: model.toLowerCase(),
      sub_model: sub_model.toLowerCase(),
      company_name: company_name,
      premium_name: premium_name,
      insurance_type: insurance_type,
      responsibility_body_person: responsibility_body_person,
      responsibility_body_times: responsibility_body_times,
      responsibility_asset: responsibility_asset,
      // car_damage: car_damage,
      first_damage: first_damage,
      // car_lost_fire: car_lost_fire,
      personal_accident: personal_accident,
      personal_accident_number: personal_accident_number,
      medical: medical,
      medical_number: medical_number,
      criminal_driver: criminal_driver,
      insurance_premium_type: insurance_premium_type,
      insurance_premium_condition: insurance_premium_condition,
      sum_insured_min: sum_insured_min,
      sum_insured_max: sum_insured_max,
      car_age_min: car_age_min,
      car_age_max: car_age_max,
      fund_regis_bkk: fund_regis_bkk,
      fund_regis_up_country: fund_regis_up_country,
    });

    await newPremium.save();
    //Example for log information data
    // logger.info("Car", {
    //   Patient: id,
    //   brain: brain,
    // });
    return res.status(201).json({
      ...responseMessage.success,
      data: "ทำรายการเรียบร้อยแล้ว",
    });
  } catch (error) {
    //Example for log error data
    // logger.error(error.message);
    next(error);
  }
};

exports.listPremium = async (req, res, next) => {
  try {
    const premiumList = await CarPremiums.find()
      .select("-_id -createdAt -updatedAt -__v")
      .lean();

    return res.status(200).json({
      ...responseMessage.success,
      data: premiumList,
    });
  } catch (error) {
    next(error);
  }
};
