const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Brands = require("../models/brands");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
// const s3url = require("../utils/content");
// const logger = require("../utils/logger");

exports.addBrand = async (req, res, next) => {
  try {
    const { brand_name } = req.body;

    const existBrand = await Brands.findOne({
      brand_name: brand_name.toLowerCase(),
    });
    if (existBrand) {
      const error = new Error("ไม่สามารถสร้าง Brand ซ้ำได้");
      error.statusCode = 404;
      throw error;
    }

    let newBrand = new Brands({
      brand_name: brand_name.toLowerCase(),
    });

    await newBrand.save();
    //Example for log information data
    // logger.info("Car", {
    //   Patient: id,
    //   brain: brain,
    // });
    return res.status(201).json({
      ...responseMessage.success,
      data: "บันทึก Brand เรียบร้อยแล้ว",
    });
  } catch (error) {
    //Example for log error data
    // logger.error(error.message);
    next(error);
  }
};

exports.listBrand = async (req, res, next) => {
  try {
    const brandList = await Brands.find().select("brand_name").lean();

    return res.status(200).json({
      ...responseMessage.success,
      data: brandList,
    });
  } catch (error) {
    next(error);
  }
};
