const express = require("express");
const router = express.Router();
const {
  getProduct,
  getProductById,
  createProduct,
  photo,
  removeProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");
const { getUserById } = require("../controllers/user");
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");

router.param("userId", getUserById);
router.param("productId", getProductById);
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeProduct
);
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);
router.get("/products", getAllProducts);
router.get("/products", getAllUniqueCategories);

module.exports = router;
