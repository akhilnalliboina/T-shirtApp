const express = require("express");
const router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check } = require("express-validator");

router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("name be at least 3 chars long"),
    check("email").isEmail().withMessage("Email is required"),
    check("password")
      .isLength({ min: 3 })
      .withMessage("password must be at least 3 chars long"),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Email is required"),
    check("password")
      .isLength({ min: 3 })
      .withMessage("password is mandatory field"),
  ],
  signin
);
router.get("/signout", signout);

module.exports = router;
