const { default: products} = require('../models/productSchema');
const mongoose = require('mongoose');
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const uploadDir = path.join(__dirname, "../../uploads");

const createSlug = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const processUploadedImage = async (file) => {
  if (!file) {
    return null;
  }

  await fs.promises.mkdir(uploadDir, { recursive: true });

  const filename = `${crypto.randomUUID()}.webp`;
  const outputPath = path.join(uploadDir, filename);

  await sharp(file.buffer)
    .rotate()
    .resize(1200, 1200, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(outputPath);

  return `/uploads/${filename}`;
};

exports.getProducts = async (req, res) => {
  try {
    const categorySlug = req.params.category || req.query.category;
    const allProducts = await products.find({}).populate("category", "name slug");
    const productList = categorySlug
      ? allProducts.filter((product) => product.category?.slug === categorySlug)
      : allProducts;

    res.status(200).json({
      success: true,
      products: productList,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server Error");
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      brand,
      description,
      category,
      subcategory,
      price,
      discountPrice,
      stock,
      sku,
      isTodayDeal,
      isNewArrival,
      isBestSeller,
      isActive,
    } = req.body;

    if (!name || !brand || !description || !category || price === undefined) {
      return res.status(400).json({
        msg: "name, brand, description, category, and price are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ msg: "Invalid category ID" });
    }

    const image = (await processUploadedImage(req.file)) || req.body.image;

    const newProduct = new products({
      name,
      slug: slug ? createSlug(slug) : createSlug(name),
      brand,
      description,
      category,
      subcategory,
      price,
      discountPrice,
      stock,
      sku,
      image,
      isTodayDeal,
      isNewArrival,
      isBestSeller,
      isActive,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ msg: error.message });
    }

    if (error.code === 11000) {
      return res.status(409).json({ msg: "A product with this slug or SKU already exists" });
    }

    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

exports.getProductsById = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await products.find({ sellerId: userId });
    if (!items || items.length === 0) {
      return res.status(404).json({ msg: "No products found for this seller" });
    }
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching product:", error); 
    res.status(500).send("Server Error");
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Invalid product ID" });
    }

    const productDetails = await products.findById(productId).populate("category", "name slug");
    if (!productDetails) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(200).json(productDetails);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).send("Server Error");
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await products.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error); 
    res.status(500).send("Server Error");
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid product ID" });
    }

    const {
      name,
      slug,
      brand,
      description,
      category,
      subcategory,
      price,
      discountPrice,
      stock,
      sku,
      isTodayDeal,
      isNewArrival,
      isBestSeller,
      isActive,
    } = req.body;
    const image = req.file
      ? await processUploadedImage(req.file)
      : req.body.image;
    const update = {
      name,
      slug: slug ? createSlug(slug) : name ? createSlug(name) : undefined,
      brand,
      description,
      category,
      subcategory,
      price,
      discountPrice,
      stock,
      sku,
      image,
      isTodayDeal,
      isNewArrival,
      isBestSeller,
      isActive,
    };

    Object.keys(update).forEach((key) => {
      if (update[key] === undefined) {
        delete update[key];
      }
    });

    if (category !== undefined && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ msg: "Invalid category ID" });
    }

    const updatedProduct = await products.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error); 

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ msg: error.message });
    }

    if (error.code === 11000) {
      return res.status(409).json({ msg: "A product with this slug or SKU already exists" });
    }

    res.status(500).send("Server Error");
  }
}







