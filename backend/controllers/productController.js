const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by active status
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    // Filter by featured
    if (req.query.isFeatured !== undefined) {
      query.isFeatured = req.query.isFeatured === 'true';
    }

    // Search by name or description
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter out products with invalid category references
    const validProducts = products.filter(product => product.category !== null);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: validProducts.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: validProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if category reference is valid
    if (!product.category) {
      return res.status(404).json({
        success: false,
        message: 'Product category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Generate SKU if not provided
    if (!productData.sku) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      productData.sku = (productData.name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0,6) + timestamp.toString().slice(-4) + random).substring(0,20);
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
      productData.mainImage = productData.images[0]; // First image as main image
    }

    const product = await Product.create(productData);

    // Update category product count
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: 1 } });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product SKU already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create multiple products
// @route   POST /api/products/bulk
// @access  Private
const createProductsBulk = async (req, res) => {
  try {
    const productsData = req.body.products || [];

    if (!Array.isArray(productsData) || productsData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required'
      });
    }

    const createdProducts = [];
    const errors = [];

    for (let i = 0; i < productsData.length; i++) {
      try {
        const product = await Product.create(productsData[i]);

        // Update category product count
        await Category.findByIdAndUpdate(product.category, { $inc: { productCount: 1 } });

        createdProducts.push(product);
      } catch (error) {
        errors.push({
          index: i,
          name: productsData[i].name,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      data: createdProducts,
      errors: errors.length > 0 ? errors : undefined,
      message: `Created ${createdProducts.length} products${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if category is being changed
    const oldCategory = product.category;
    const newCategory = req.body.category;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('category', 'name');

    // Update category product counts if category changed
    if (oldCategory.toString() !== newCategory) {
      await Category.findByIdAndUpdate(oldCategory, { $inc: { productCount: -1 } });
      await Category.findByIdAndUpdate(newCategory, { $inc: { productCount: 1 } });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product SKU already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update category product count
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Private
const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          featuredProducts: {
            $sum: { $cond: ['$isFeatured', 1, 0] }
          },
          outOfStock: {
            $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] }
          },
          lowStock: {
            $sum: { $cond: [{ $lte: ['$stock', 5] }, 1, 0] }
          },
          averagePrice: { $avg: '$price' },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        featuredProducts: 0,
        outOfStock: 0,
        lowStock: 0,
        averagePrice: 0,
        totalValue: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all products for public display
// @route   GET /api/public/products
// @access  Public
const getPublicProducts = async (req, res) => {
  try {
    // Build query for public display - only active products
    let query = { isActive: true };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by featured
    if (req.query.isFeatured !== undefined) {
      query.isFeatured = req.query.isFeatured === 'true';
    }

    // Search by name or description
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .select('name price images mainImage category description isFeatured stock')
      .sort({ createdAt: -1 });

    // Filter out products with invalid category references
    const validProducts = products.filter(product => product.category !== null);

    res.status(200).json({
      success: true,
      data: validProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single product for public display
// @route   GET /api/public/products/:id
// @access  Public
const getPublicProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name');

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if category reference is valid
    if (!product.category) {
      return res.status(404).json({
        success: false,
        message: 'Product category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
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
  getProducts,
  getProduct,
  createProduct,
  createProductsBulk,
  updateProduct,
  deleteProduct,
  getProductStats,
  getPublicProducts,
  getPublicProduct
};