const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const brandControllers = require("../controllers/brandControllers");

router.post("/addBrand", brandControllers.addBrand);
router.get("/listBrand", brandControllers.listBrand);
// router.get("/agingsList/:id", agingController.agingsList);
// router.put("/update/:id", agingController.update);

module.exports = router;
