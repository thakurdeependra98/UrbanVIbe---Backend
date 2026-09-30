const cart = require("../models/cartSchema");
const products = require("../models/productSchema");
const mongoose = require("mongoose");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const validId = mongoose.Types.ObjectId.isValid(productId)
    ? new mongoose.Types.ObjectId(productId)
    : null;

    if (!validId) {
      return res.status(400).json({ msg: "Invalid product ID" });
    }

    const product = await products.findById(validId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    let cartItem = await cart.findOne({ userId, productId });
    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
      return res.status(200).json(cartItem);
    } else {
      const newCartItem = new cart({
        userId,
        productId,
        quantity: quantity || 1,
      });
      await newCartItem.save();
      return res.status(201).json(newCartItem);
    }
  } catch (error) {
    console.error("Error adding to cart:", error); 
    res.status(500).send("Server Error");
  }
}

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await cart.find({ userId }).populate("productId");
    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ msg: "No items in cart" });
    }
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error); 
    res.status(500).send("Server Error");
  }
}

exports.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params; // Ensure the frontend sends the correct cart item ID
    const cartItem = await cart.findByIdAndDelete(id);
    if (!cartItem) {
      return res.status(404).json({ msg: "Cart item not found" });
    }
    res.status(200).json({ msg: "Cart item deleted successfully", cartItem });
  } catch (error) {
    console.error("Error deleting cart item:", error); 
    res.status(500).send("Server Error");
  }
}

exports.increaseQuantity = async (req, res) => {
  try {
    const { id } = req.params; 
    const cartItem = await cart.findById(id);
    if (!cartItem) {
      return res.status(404).json({ msg: "Cart item not found" });
    }
    cartItem.quantity += 1;
    await cartItem.save();
    res.status(200).json(cartItem);
  } catch (error) {
    console.error("Error increasing quantity:", error);
    res.status(500).send("Server Error");
  }
};

exports.decreaseQuantity = async (req, res) => {
  try {
    const { id } = req.params; 
    const cartItem = await cart.findById(id); 
    if (!cartItem) {
      return res.status(404).json({ msg: "Cart item not found" });
    }
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
      res.status(200).json(cartItem);
    } else {
      await cart.findByIdAndDelete(cartItem._id);
      res.status(200).json({ msg: "Cart item deleted successfully" });
    }
  } catch (error) {
    console.error("Error decreasing quantity:", error);
    res.status(500).send("Server Error");
  }
};

