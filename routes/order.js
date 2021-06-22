const express = require("express");
const { isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth");
const router = express.Router();
const {
  getByOrderId,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateStatus,
} = require("../controllers/order");
const { updateStock } = require("../controllers/product");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");

router.param("orderId", getByOrderId);
router.param("userId", getUserById);
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);
router.get(
  "/orders/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);

router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
