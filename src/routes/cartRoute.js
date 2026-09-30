const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addToCart, getCartItems, deleteCartItem, increaseQuantity, decreaseQuantity } = require("../controllers/cartControllers");

router.post("/addToCart", authMiddleware, addToCart);
router.get("/getCartItems", authMiddleware, getCartItems);
router.delete("/deleteCartItem/:id", authMiddleware, deleteCartItem);
router.put("/increaseQuantity/:id", authMiddleware, increaseQuantity);
router.put("/decreaseQuantity/:id", authMiddleware, decreaseQuantity);

module.exports = router;