const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const config = require("../config/index");
const responseMessage = require("../utils/responseMessage");
const axios = require("axios");

exports.register = async (req, res, next) => {
  try {
    const { username, password, firstName, lastName, role } = req.body;
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("format invalid");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const existUser = await User.findOne({ username });
    if (existUser) {
      const error = new Error("Username already use!!");
      error.statusCode = 400;
      throw error;
    }
    let user = new User();
    user.username = username;
    user.password = await user.encryPassword(password);
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = role;
    await user.save();
    return res
      .status(201)
      .json({ ...responseMessage.success, data: "Registed" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    //check email exist system
    const user = await User.findOne({ username: username }).select(
      "-createdAt -updatedAt -__v"
    );
    if (!user) {
      const error = new Error("Username Not Found");
      error.statusCode = 404;
      throw error;
    }
    // compare password ถ้าไม่ตรง Return false
    const isValid = await user.checkPassword(password);
    if (!isValid) {
      const error = new Error("Password Invalid");
      error.statusCode = 401;
      throw error;
    }

    //create token
    const token = await jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      { expiresIn: "10 days" }
    );

    //decode expiresIn
    const expires_in = jwt.decode(token);

    return res.status(200).json({
      ...responseMessage.success,
      data: user,
      message: "login success",
      access_token: token,
      expires_in: expires_in.exp,
      token_type: "Bearer",
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, password, firstName, lastName, role } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("format invalid");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const existUser = await User.findOne().where("username").eq(username);
    if (!existUser) {
      const error = new Error("Username does not exist!!");
      error.statusCode = 401;
      throw error;
    }
    if (existUser.password === password) {
      const error = new Error("New password are same with old password!!");
      error.statusCode = 401;
      throw error;
    }

    const editUser = await User.updateOne(
      { _id: id },
      {
        password: await existUser.encryPassword(password),
        firstName,
        lastName,
        role,
      }
    );
    if (editUser.nModified === 0) {
      throw new Error("ไม่สามารถแก้ไขข้อมูลได้");
    } else {
      res.status(200).json({
        ...responseMessage.success,
        data: "updated",
      });
    }
  } catch (error) {
    next(error);
  }
};

// exports.me = async (req, res, next) => {
//   try {
//     return res.status(200).json({
//       ...responseMessage.success,
//       data: req.user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
