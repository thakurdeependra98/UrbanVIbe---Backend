const wishlist = require("../models/wishlistSchema");
const products = require("../models/productSchema");


exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    const existingWishlistItem = await wishlist.findOne({ userId, productId });
    if (existingWishlistItem) {
      return res.status(400).json({ msg: "Product already in wishlist" });
    }
    const newWishlistItem = new wishlist({
      userId,
      productId,
    });
    await newWishlistItem.save();
    const populatedWishlistItem = await newWishlistItem.populate("productId");
    res.status(201).json({ msg: "Product added to wishlist", newWishlistItem: populatedWishlistItem });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
}

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlistItems = await wishlist.find({ userId }).populate("productId");
    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
}

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    await wishlist.findOneAndDelete({ userId, productId });
    res.status(200).json({ msg: "Product removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
}