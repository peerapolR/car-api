const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Brands = require("../models/brands");
const Cars = require("../models/cars");
const CarTypes = require("../models/car_types");
const CarPremiums = require("../models/car_premiums");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
// const s3url = require("../utils/content");
// const logger = require("../utils/logger");

exports.addCar = async (req, res, next) => {
  try {
    const { brand_name, model, sub_model, start_production } = req.body;

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
      sub_model: sub_model.toLowerCase(),
    });

    if (existCar) {
      const error = new Error("ไม่สามารถบันทึกรายการรถยนต์ซ้ำได้");
      error.statusCode = 404;
      throw error;
    }

    let newCar = new Cars({
      brand_name: brand_name.toLowerCase(),
      model: model.toLowerCase(),
      sub_model: sub_model.toLowerCase(),
      start_production: parseInt(start_production),
    });

    await newCar.save();
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

exports.listCar = async (req, res, next) => {
  try {
    const { brand_name } = req.body;
    const existBrand = await Brands.find({
      brand_name: brand_name.toLowerCase(),
    });
    if (!existBrand) {
      const error = new Error("ไม่พบ Brand กรุณาสร้าง Brand ก่อนทำรายการ");
      error.statusCode = 404;
      throw error;
    }
    const carList = await Cars.find({ brand_name: brand_name.toLowerCase() })
      .select("-_id -createdAt -updatedAt -__v")
      .lean();

    return res.status(200).json({
      ...responseMessage.success,
      data: carList,
    });
  } catch (error) {
    next(error);
  }
};

exports.listCarTypes = async (req, res, next) => {
  try {
    const carTypesList = await CarTypes.find()
      .select("car_code car_type")
      .lean();

    return res.status(200).json({
      ...responseMessage.success,
      data: carTypesList,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCarInsuranceQuotation = async (req, res, next) => {
  try {
    const {
      car_type,
      insurance_type,
      brand_name,
      model,
      sub_model,
      year,
      amount,
      first_damage,
      insurance_premium_type,
    } = req.body;

    const existBrand = await Brands.find({
      brand_name: brand_name.toLowerCase(),
    });
    if (!existBrand) {
      const error = new Error("ไม่พบ Brand กรุณาติดต่อเจ้าหน้าที่");
      error.statusCode = 404;
      throw error;
    }

    if (first_damage && !insurance_premium_type) {
      const quoCheck1 = await CarPremiums.find({
        car_type: car_type,
        insurance_type: parseInt(insurance_type),
        brand_name: brand_name.toLowerCase(),
        model: model.toLowerCase(),
        $and: [
          {
            sub_model: sub_model.toLowerCase(),
          },
          {
            sum_insured_min: { $lte: amount },
            sum_insured_max: { $gte: amount },
          },
          {
            car_age_min: { $lte: year },
            car_age_max: { $gte: year },
          },
          {
            first_damage: first_damage,
          },
        ],
      })
        .select("-_id -createdAt -updatedAt -__v")
        .lean();

      if (quoCheck1.length === 0) {
        const quoCheck2 = await CarPremiums.find({
          car_type: car_type,
          insurance_type: parseInt(insurance_type),
          brand_name: brand_name.toLowerCase(),
          model: model.toLowerCase(),
          $and: [
            {
              sub_model: "all",
            },
            {
              sum_insured_min: { $lte: amount },
              sum_insured_max: { $gte: amount },
            },
            {
              car_age_min: { $lte: year },
              car_age_max: { $gte: year },
            },
            {
              first_damage: first_damage,
            },
          ],
        })
          .select("-_id -createdAt -updatedAt -__v")
          .lean();

        return res.status(200).json({
          ...responseMessage.success,
          data: quoCheck2,
        });
      } else {
        return res.status(200).json({
          ...responseMessage.success,
          data: quoCheck1,
        });
      }
    } else if (insurance_premium_type && !first_damage) {
      const quoCheck1 = await CarPremiums.find({
        car_type: car_type,
        insurance_type: parseInt(insurance_type),
        brand_name: brand_name.toLowerCase(),
        model: model.toLowerCase(),
        $and: [
          {
            sub_model: sub_model.toLowerCase(),
          },
          {
            sum_insured_min: { $lte: amount },
            sum_insured_max: { $gte: amount },
          },
          {
            car_age_min: { $lte: year },
            car_age_max: { $gte: year },
          },
          {
            insurance_premium_type: insurance_premium_type,
          },
        ],
      })
        .select("-_id -createdAt -updatedAt -__v")
        .lean();

      if (quoCheck1.length === 0) {
        const quoCheck2 = await CarPremiums.find({
          car_type: car_type,
          insurance_type: parseInt(insurance_type),
          brand_name: brand_name.toLowerCase(),
          model: model.toLowerCase(),
          $and: [
            {
              sub_model: "all",
            },
            {
              sum_insured_min: { $lte: amount },
              sum_insured_max: { $gte: amount },
            },
            {
              car_age_min: { $lte: year },
              car_age_max: { $gte: year },
            },
            {
              insurance_premium_type: insurance_premium_type,
            },
          ],
        })
          .select("-_id -createdAt -updatedAt -__v")
          .lean();

        return res.status(200).json({
          ...responseMessage.success,
          data: quoCheck2,
        });
      } else {
        return res.status(200).json({
          ...responseMessage.success,
          data: quoCheck1,
        });
      }
    } else if (first_damage && insurance_premium_type) {
      const quoCheck1 = await CarPremiums.find({
        car_type: car_type,
        insurance_type: parseInt(insurance_type),
        brand_name: brand_name.toLowerCase(),
        model: model.toLowerCase(),
        $and: [
          {
            sub_model: sub_model.toLowerCase(),
          },
          {
            sum_insured_min: { $lte: amount },
            sum_insured_max: { $gte: amount },
          },
          {
            car_age_min: { $lte: year },
            car_age_max: { $gte: year },
          },
          {
            insurance_premium_type: insurance_premium_type,
          },
          {
            first_damage: first_damage,
          },
        ],
      })
        .select("-_id -createdAt -updatedAt -__v")
        .lean();

      if (quoCheck1.length === 0) {
        const quoCheck2 = await CarPremiums.find({
          car_type: car_type,
          insurance_type: parseInt(insurance_type),
          brand_name: brand_name.toLowerCase(),
          model: model.toLowerCase(),
          $and: [
            {
              sub_model: "all",
            },
            {
              sum_insured_min: { $lte: amount },
              sum_insured_max: { $gte: amount },
            },
            {
              car_age_min: { $lte: year },
              car_age_max: { $gte: year },
            },
            {
              insurance_premium_type: insurance_premium_type,
            },
            {
              first_damage: first_damage,
            },
          ],
        })
          .select("-_id -createdAt -updatedAt -__v")
          .lean();

        return res.status(200).json({
          ...responseMessage.success,
          data: quoCheck2,
        });
      } else {
        return res.status(200).json({
          ...responseMessage.success,
          data: quoCheck1,
        });
      }
    } else {
      const result = await CarPremiums.find({
        car_type: 110,
        insurance_type: 1,
        brand_name: "mercedes-benz",
        model: "cla-class",
        sub_model: "cla 200",
        sum_insured_min: { $lte: 1100000 },
        sum_insured_max: { $gte: 1100000 },
        car_age_min: { $lte: 4 },
        car_age_max: { $gte: 4 },
      }).lean();
      console.log(result);

      const quoCheck1 = await CarPremiums.find({
        car_type: car_type,
        insurance_type: parseInt(insurance_type),
        brand_name: brand_name.toLowerCase(),
        model: model.toLowerCase(),
        sub_model: sub_model.toLowerCase(),
        sum_insured_min: { $lte: amount },
        sum_insured_max: { $gte: amount },
        car_age_min: { $lte: year },
        car_age_max: { $gte: year },
      })
        .select("-_id -createdAt -updatedAt -__v")
        .lean();


      if (quoCheck1.length === 0) {
        const quoCheck2 = await CarPremiums.find({
          car_type: car_type,
          insurance_type: parseInt(insurance_type),
          brand_name: brand_name.toLowerCase(),
          model: model.toLowerCase(),
          $and: [
            {
              sub_model: "all",
            },
            {
              sum_insured_min: { $lte: amount },
              sum_insured_max: { $gte: amount },
            },
            {
              car_age_min: { $lte: year },
              car_age_max: { $gte: year },
            },
          ],
        })
          .select("-_id -createdAt -updatedAt -__v")
          .lean();

        return res.status(200).json({
          ...responseMessage.success,
          data: quoCheck2,
        });
      } else {
        return res.status(200).json({
          ...responseMessage.success,
          data: quoCheck1,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
