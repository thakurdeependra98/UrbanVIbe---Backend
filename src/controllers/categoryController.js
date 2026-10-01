const { default: Category } = require("../models/categorySchema");

const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      image,
      subcategories,
      isActive,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const existingCategory = await Category.findOne({
      $or: [
        { name: name.trim() },
        { slug: slug.toLowerCase().trim() },
      ],
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category with this name or slug already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: slug.toLowerCase().trim(),
      description: description?.trim() || "",
      image: image || "",
      subcategories: subcategories || [],
      isActive: isActive ?? true,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = { createCategory, getCategories };