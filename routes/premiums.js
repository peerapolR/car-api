const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const premiumControllers = require("../controllers/premiumControllers");

router.post("/addPremiums", premiumControllers.addPremiums);
router.get("/listPremium", premiumControllers.listPremium);

module.exports = router;
