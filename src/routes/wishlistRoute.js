const express = require('express');
const router = express.Router();

const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistControllers');
const  authMiddleware  = require('../middleware/authMiddleware');

router.post('/addWishlist', authMiddleware, addToWishlist);
router.get('/getWishlist', authMiddleware, getWishlist);
router.delete('/removeWishlist', authMiddleware, removeFromWishlist);

module.exports = router;