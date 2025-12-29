const Blog = require('../models/Blog');
const Admin = require('../models/Admin');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Private
const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Filter by published status
    if (req.query.isPublished !== undefined) {
      query.isPublished = req.query.isPublished === 'true';
    }

    // Filter by author
    if (req.query.author) {
      query.author = req.query.author;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Private
const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get published blogs (public)
// @route   GET /api/public/blogs
// @access  Public
const getPublishedBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ isPublished: true })
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ isPublished: true });

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single published blog (public)
// @route   GET /api/public/blogs/:slug
// @access  Public
const getPublishedBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      isPublished: true
    })
      .populate('author', 'username');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.admin._id
    };

    // Handle tags
    if (req.body.tags) {
      try {
        blogData.tags = JSON.parse(req.body.tags);
      } catch (error) {
        blogData.tags = req.body.tags.split(',').map(tag => tag.trim());
      }
    }

    // Handle image upload
    if (req.file) {
      blogData.image = `/uploads/blogs/${req.file.filename}`;
    }

    const blog = await Blog.create(blogData);

    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username email');

    res.status(201).json({
      success: true,
      data: populatedBlog
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Blog with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if admin owns the blog or is updating their own
    if (blog.author.toString() !== req.admin._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog'
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('author', 'username email');

    res.status(200).json({
      success: true,
      data: updatedBlog
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Blog with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if admin owns the blog
    if (blog.author.toString() !== req.admin._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog'
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Publish/Unpublish blog
// @route   PUT /api/blogs/:id/publish
// @access  Private
const togglePublishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if admin owns the blog
    if (blog.author.toString() !== req.admin._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this blog'
      });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username email');

    res.status(200).json({
      success: true,
      message: `Blog ${blog.isPublished ? 'published' : 'unpublished'} successfully`,
      data: populatedBlog
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
  getBlogs,
  getBlog,
  getPublishedBlogs,
  getPublishedBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublishBlog
};