import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: String,
      trim: true,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
    },

    // Inventory
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    sku: {
      type: String,
      unique: true,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    // Product Variants
    // variants: [
    //   {
    //     color: {
    //       type: String,
    //       trim: true,
    //     },

    //     size: {
    //       type: String,
    //       trim: true,
    //     },

    //     stock: {
    //       type: Number,
    //       min: 0,
    //       default: 0,
    //     },

    //     price: {
    //       type: Number,
    //       min: 0,
    //     },

    //     sku: {
    //       type: String,
    //       trim: true,
    //     },
    //   },
    // ],

    // Product Details
    // material: {
    //   type: String,
    //   trim: true,
    // },

    // specifications: {
    //   type: Map,
    //   of: String,
    //   default: {},
    // },

    // tags: [
    //   {
    //     type: String,
    //     trim: true,
    //     lowercase: true,
    //   },
    // ],

    // // Ratings
    // rating: {
    //   type: Number,
    //   default: 0,
    //   min: 0,
    //   max: 5,
    // },

    // reviewCount: {
    //   type: Number,
    //   default: 0,
    // },

    // Store Flags
    isTodayDeal: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;