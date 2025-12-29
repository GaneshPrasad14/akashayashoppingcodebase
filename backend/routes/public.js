const express = require('express');
const { getPublicCategories } = require('../controllers/categoryController');
const { getPublicProducts, getPublicProduct } = require('../controllers/productController');
const { getPublicReviews, createPublicReview } = require('../controllers/reviewController');
const { getPublishedBlogs, getPublishedBlog } = require('../controllers/blogController');

const router = express.Router();

// Public routes - no authentication required
router.get('/categories', getPublicCategories);
router.get('/products', getPublicProducts);
router.get('/products/:id', getPublicProduct);
router.get('/reviews', getPublicReviews);
router.post('/reviews', createPublicReview);
router.get('/blogs', getPublishedBlogs);
router.get('/blogs/:slug', getPublishedBlog);

module.exports = router;