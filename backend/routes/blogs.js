const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublishBlog
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const { uploadBlogImage } = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getBlogs)
  .post(uploadBlogImage.single('image'), createBlog);

router.route('/:id')
  .get(getBlog)
  .put(updateBlog)
  .delete(deleteBlog);

router.route('/:id/publish')
  .put(togglePublishBlog);

module.exports = router;