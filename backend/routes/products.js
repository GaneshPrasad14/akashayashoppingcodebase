const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  createProductsBulk,
  updateProduct,
  deleteProduct,
  getProductStats
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getProducts)
  .post(uploadProductImages, createProduct);

router.route('/bulk')
  .post(createProductsBulk);

router.route('/stats')
  .get(getProductStats);

router.route('/:id')
  .get(getProduct)
  .put(uploadProductImages, updateProduct)
  .delete(deleteProduct);

module.exports = router;