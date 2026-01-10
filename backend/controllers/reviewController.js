const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private
const getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Filter by product
    if (req.query.product) {
      query.product = req.query.product;
    }

    // Filter by approval status
    if (req.query.isApproved !== undefined) {
      query.isApproved = req.query.isApproved === 'true';
    }

    // Filter by verification status
    if (req.query.isVerified !== undefined) {
      query.isVerified = req.query.isVerified === 'true';
    }

    // Filter by rating
    if (req.query.rating) {
      query.rating = parseInt(req.query.rating);
    }

    const reviews = await Review.find(query)
      .populate('product', 'name mainImage')
      .populate('response.respondedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter out reviews with invalid product references
    const validReviews = reviews.filter(review => review.product !== null);

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: validReviews.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: validReviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Private
const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('product', 'name mainImage')
      .populate('response.respondedBy', 'username');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if product reference is valid
    if (!review.product) {
      return res.status(404).json({
        success: false,
        message: 'Review product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private/Public
const createReview = async (req, res) => {
  try {
    // Check if product exists
    const product = await Product.findById(req.body.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if it's a public review (no admin token)
    if (!req.admin) {
      // Public review
      const reviewData = {
        ...req.body,
        isApproved: true, // Approve public reviews immediately
        isVerified: false
      };

      const review = await Review.create(reviewData);

      res.status(201).json({
        success: true,
        data: review
      });
    } else {
      // Admin review
      const review = await Review.create(req.body);

      res.status(201).json({
        success: true,
        data: review
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Customer has already reviewed this product'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new review (public)
// @route   POST /api/public/reviews
// @access  Public
const createPublicReview = async (req, res) => {
  try {
    // Check if product exists
    const product = await Product.findById(req.body.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Set default values for public reviews - NOT auto-approved
    const reviewData = {
      ...req.body,
      isApproved: false, // Requires admin approval before displaying
      isVerified: false
    };

    const review = await Review.create(reviewData);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! It will be published after admin approval.',
      data: review
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('product', 'name mainImage')
     .populate('response.respondedBy', 'username');

    res.status(200).json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Approve review
// @route   PUT /api/reviews/:id/approve
// @access  Private
const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.isApproved = true;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review approved successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Respond to review
// @route   PUT /api/reviews/:id/respond
// @access  Private
const respondToReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.response = {
      text: req.body.response,
      respondedAt: new Date(),
      respondedBy: req.admin._id
    };

    await review.save();

    const updatedReview = await Review.findById(req.params.id)
      .populate('response.respondedBy', 'username');

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: updatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get public reviews (approved only)
// @route   GET /api/public/reviews
// @access  Public
const getPublicReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ isApproved: true })
      .populate('product', 'name mainImage')
      .populate('response.respondedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter out reviews with invalid product references
    const validReviews = reviews.filter(review => review.product !== null);

    const total = await Review.countDocuments({ isApproved: true });

    res.status(200).json({
      success: true,
      count: validReviews.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: validReviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get review statistics
// @route   GET /api/reviews/stats
// @access  Private
const getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          approvedReviews: {
            $sum: { $cond: ['$isApproved', 1, 0] }
          },
          pendingReviews: {
            $sum: { $cond: ['$isApproved', 0, 1] }
          },
          verifiedReviews: {
            $sum: { $cond: ['$isVerified', 1, 0] }
          },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    // Calculate rating distribution
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (stats[0] && stats[0].ratingDistribution) {
      stats[0].ratingDistribution.forEach(rating => {
        ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
      });
    }

    const result = stats[0] || {
      totalReviews: 0,
      approvedReviews: 0,
      pendingReviews: 0,
      verifiedReviews: 0,
      averageRating: 0
    };

    result.ratingDistribution = ratingCounts;

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
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
};