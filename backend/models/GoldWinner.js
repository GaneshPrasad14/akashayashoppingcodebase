const mongoose = require('mongoose');

const goldWinnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Winner name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true,
    maxlength: [100, 'District cannot exceed 100 characters']
  },
  orderId: {
    type: String,
    trim: true
  },
  prize: {
    type: String,
    required: [true, 'Prize details are required'],
    enum: ['5 Gram Gold Coin', '1 Gram Gold Coin']
  },
  prizeType: {
    type: String,
    enum: ['first', 'second'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String // URL to winner's image
  },
  testimonial: {
    type: String,
    maxlength: [1000, 'Testimonial cannot exceed 1000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
// goldWinnerSchema.index({ prizeType: 1, isActive: 1 });
// goldWinnerSchema.index({ createdAt: -1 });

module.exports = mongoose.model('GoldWinner', goldWinnerSchema);
