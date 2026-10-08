const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addToCart, getCartItems, increaseQuantity, decreaseQuantity, removeCartItem } = require("../controllers/cartControllers");

router.post("/addToCart", authMiddleware, addToCart);
router.get("/getCartItems", authMiddleware, getCartItems);
router.delete("/removeCartItem/:id", authMiddleware, removeCartItem);
router.put("/increaseQuantity/:id", authMiddleware, increaseQuantity);
router.put("/decreaseQuantity/:id", authMiddleware, decreaseQuantity);

module.exports = router;