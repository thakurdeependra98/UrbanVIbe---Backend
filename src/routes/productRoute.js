const express = require('express');
const { getProducts, crearteProduct, getProductsById, deleteProduct, updateProduct } = require('../controllers/productController');
const router = express.Router();
const upload = require('../middleware/multer');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/products', getProducts);
router.post('/createProduct', authMiddleware, upload.single('image'), crearteProduct); 
router.get('/productsById',authMiddleware, getProductsById);
router.delete('/deleteProduct/:id', authMiddleware, deleteProduct);
router.put('/updateProduct/:id', authMiddleware, upload.single('image'), updateProduct);

module.exports = router;