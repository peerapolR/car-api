const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Transaction = require("../models/transaction");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");

exports.createTransaction = async (req, res, next) => {
  try {
    const {
      customer_name,
      customer_tel,
      customer_email,
      customer_address,
      discount_percent,
      discount_baht,
      premium_1,
      premium_2,
      premium_3,
    } = req.body;

    let newTransaction = new Transaction({
      customer_name,
      customer_tel,
      customer_email,
      customer_address,
      discount_percent,
      discount_baht,
      premium_1,
      premium_2,
      premium_3,
    });

    await newTransaction.save();
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

exports.listAllTransaction = async (req, res, next) => {
  try {
    const allTransaction = await Transaction.find()
      .select("-updatedAt -__v")
      .lean();

    return res.status(200).json({
      ...responseMessage.success,
      data: allTransaction,
    });
  } catch (error) {
    next(error);
  }
};
