const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true 
  },
  role:{
    type: String,
    enum: ['admin', 'seller', 'buyer'],
    required: true
  },
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      }
    },
  ],
  wishlistItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
},{timestamps: true})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);