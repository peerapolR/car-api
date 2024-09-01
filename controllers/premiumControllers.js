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
      insurance_type,
      responsibility_body_min,
      responsibility_body_max,
      responsibility_asset,
      car_damage,
      first_damage,
      car_lost_fire,
      personal_accident,
      personal_accident_number,
      medical,
      medical_number,
      criminal_driver,
      insurance_premium_type,
      insurance_premium_condition,
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
      insurance_type: insurance_type,
      responsibility_body_min: responsibility_body_min,
      responsibility_body_max: responsibility_body_max,
      responsibility_asset: responsibility_asset,
      car_damage: car_damage,
      first_damage: first_damage,
      car_lost_fire: car_lost_fire,
      personal_accident: personal_accident,
      personal_accident_number: personal_accident_number,
      medical: medical,
      medical_number: medical_number,
      criminal_driver: criminal_driver,
      insurance_premium_type: insurance_premium_type,
      insurance_premium_condition: insurance_premium_condition,
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
