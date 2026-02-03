const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [50, 'Customer name cannot exceed 50 characters']
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  images: [{
    type: String // URLs to review images
  }],
  orderId: {
    type: String,
    trim: true
  },
  response: {
    text: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ product: 1, isApproved: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

// Prevent duplicate reviews from same customer for same product
reviewSchema.index({ product: 1, customerEmail: 1 }, { unique: true });

// Update product rating when review is saved
reviewSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  await updateProductRating(this.product);
});

// Update product rating when review is removed
reviewSchema.post('remove', async function() {
  const Product = mongoose.model('Product');
  await updateProductRating(this.product);
});

async function updateProductRating(productId) {
  const Product = mongoose.model('Product');
  const Review = mongoose.model('Review');

  const result = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(result[0].avgRating * 10) / 10, // Round to 1 decimal
      reviewCount: result[0].count
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      reviewCount: 0
    });
  }
}

module.exports = mongoose.model('Review', reviewSchema);