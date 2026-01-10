const express = require('express');
const {
  getReviews,
  getReview,
  getPublicReviews,
  createReview,
  createPublicReview,
  updateReview,
  deleteReview,
  approveReview,
  respondToReview,
  getReviewStats
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public route for getting approved reviews (no auth required)
router.get('/public/reviews', getPublicReviews);

// All other routes require authentication
router.use(protect);

router.route('/')
  .get(getReviews)
  .post(createReview);

router.route('/stats')
  .get(getReviewStats);

router.route('/:id')
  .get(getReview)
  .put(updateReview)
  .delete(deleteReview);

router.route('/:id/approve')
  .put(approveReview);

router.route('/:id/respond')
  .put(respondToReview);

module.exports = router;