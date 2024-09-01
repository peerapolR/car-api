const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const carControllers = require("../controllers/carControllers");

router.post("/addCar", carControllers.addCar);
router.post("/listCar", carControllers.listCar);
router.get("/listCarTypes", carControllers.listCarTypes);
router.post(
  "/getCarInsuranceQuotation",
  carControllers.getCarInsuranceQuotation
);

module.exports = router;
