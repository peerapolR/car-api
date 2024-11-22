const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const transactionControllers = require("../controllers/transactionControllers");

router.post("/createTransaction", transactionControllers.createTransaction);
router.get("/listAllTransaction", transactionControllers.listAllTransaction);

module.exports = router;
