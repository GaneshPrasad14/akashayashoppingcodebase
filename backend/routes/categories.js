const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  createCategoriesBulk,
  updateCategory,
  deleteCategory,
  getCategoriesDropdown
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { uploadCategoryImage } = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getCategories)
  .post(uploadCategoryImage.single('image'), createCategory);

router.route('/bulk')
  .post(createCategoriesBulk);

router.route('/dropdown')
  .get(getCategoriesDropdown);

router.route('/:id')
  .get(getCategory)
  .put(uploadCategoryImage.single('image'), updateCategory)
  .delete(deleteCategory);

module.exports = router;