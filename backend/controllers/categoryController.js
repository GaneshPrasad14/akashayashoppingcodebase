const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments();

    res.status(200).json({
      success: true,
      count: categories.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const categoryData = { ...req.body };

    // Handle uploaded image
    if (req.file) {
      categoryData.image = `/uploads/categories/${req.file.filename}`;
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create multiple categories
// @route   POST /api/categories/bulk
// @access  Private
const createCategoriesBulk = async (req, res) => {
  try {
    const categoriesData = req.body.categories || [];

    if (!Array.isArray(categoriesData) || categoriesData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Categories array is required'
      });
    }

    const createdCategories = [];
    const errors = [];

    for (let i = 0; i < categoriesData.length; i++) {
      try {
        const category = await Category.create(categoriesData[i]);
        createdCategories.push(category);
      } catch (error) {
        errors.push({
          index: i,
          name: categoriesData[i].name,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      data: createdCategories,
      errors: errors.length > 0 ? errors : undefined,
      message: `Created ${createdCategories.length} categories${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    if (category.productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products. Please reassign or delete the products first.'
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get categories for dropdown
// @route   GET /api/categories/dropdown
// @access  Private
const getCategoriesDropdown = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .select('name _id')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all categories for public display
// @route   GET /api/public/categories
// @access  Public
const getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .select('name description image productCount sortOrder')
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories
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
  getCategories,
  getCategory,
  createCategory,
  createCategoriesBulk,
  updateCategory,
  deleteCategory,
  getCategoriesDropdown,
  getPublicCategories
};