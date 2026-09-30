const { default: products} = require('../models/productSchema');

exports.getProducts = async (req, res) => {
  try {
    const categorySlug = req.query.category?.trim().toLowerCase();
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

exports.crearteProduct = async (req, res) => {
  try {
    const { title, description, price, oldPrice, category, image } = req.body;
    const sellerId = req.user.id;

    const newProduct = new products({
      title,
      description,
      price,
      oldPrice,
      category,
      image,
      sellerId,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
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
    const { title, description, price, oldPrice, category, image } = req.body;

    const updatedProduct = await products.findByIdAndUpdate(
      id,
      { title, description, price, oldPrice, category, image },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error); 
    res.status(500).send("Server Error");
  }
}









