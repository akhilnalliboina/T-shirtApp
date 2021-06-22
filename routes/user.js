const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");

router.param("userId", getUserById);
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId", updateUser);
router.put("/orders/user/:userId", userPurchaseList);

module.exports = router;
