const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    trim: true,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  image: {
    type: String, // URL to blog image
    required: [true, 'Blog image is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Author is required']
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Indexes
blogSchema.index({ isPublished: 1, createdAt: -1 });
blogSchema.index({ slug: 1 });
blogSchema.index({ author: 1 });

module.exports = mongoose.model('Blog', blogSchema);