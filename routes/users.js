const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/userControllers");
const passportJWT = require("../middlewares/passportJWT");

router.post(
  "/register",
  [
    body("username").not().isEmpty().withMessage("required username"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 character"),
    body("firstName").not().isEmpty().withMessage("required first name"),
    body("lastName").not().isEmpty().withMessage("required last name"),
    body("role")
      .isIn(["doctor", "nurse", "super admin"])
      .withMessage("Please use doctor or nurse"),
    // body("email").isEmail().normalizeEmail(),
  ],
  userController.register
);
router.post("/login", userController.login);
router.put("/update/:id", userController.update);
// router.get("/me", [passportJWT.isLogin], userController.me);
// router.get("/profile", [passportJWT.isLogin], userController.profile);

module.exports = router;
