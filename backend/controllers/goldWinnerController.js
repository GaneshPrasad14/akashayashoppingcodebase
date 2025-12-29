const GoldWinner = require('../models/GoldWinner');

// @desc    Get all gold winners
// @route   GET /api/gold-winners
// @access  Private
const getGoldWinners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.prizeType) {
      query.prizeType = req.query.prizeType;
    }
    if (req.query.isActive !== undefined) {
      query.isActive = req.query.isActive === 'true';
    }

    const winners = await GoldWinner.find(query)
      .sort({ prizeType: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await GoldWinner.countDocuments(query);

    res.status(200).json({
      success: true,
      count: winners.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: winners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single gold winner
// @route   GET /api/gold-winners/:id
// @access  Private
const getGoldWinner = async (req, res) => {
  try {
    const winner = await GoldWinner.findById(req.params.id);

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: 'Winner not found'
      });
    }

    res.status(200).json({
      success: true,
      data: winner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create gold winner
// @route   POST /api/gold-winners
// @access  Private
const createGoldWinner = async (req, res) => {
  try {
    const winner = await GoldWinner.create(req.body);

    res.status(201).json({
      success: true,
      data: winner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update gold winner
// @route   PUT /api/gold-winners/:id
// @access  Private
const updateGoldWinner = async (req, res) => {
  try {
    const winner = await GoldWinner.findById(req.params.id);

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: 'Winner not found'
      });
    }

    const updatedWinner = await GoldWinner.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedWinner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete gold winner
// @route   DELETE /api/gold-winners/:id
// @access  Private
const deleteGoldWinner = async (req, res) => {
  try {
    const winner = await GoldWinner.findById(req.params.id);

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: 'Winner not found'
      });
    }

    await winner.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Winner deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get public gold winners (active only, ordered)
// @route   GET /api/public/gold-winners
// @access  Public
const getPublicGoldWinners = async (req, res) => {
  try {
    const winners = await GoldWinner.find({ isActive: true })
      .sort({ prizeType: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: winners.length,
      data: winners
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
  getGoldWinners,
  getGoldWinner,
  createGoldWinner,
  updateGoldWinner,
  deleteGoldWinner,
  getPublicGoldWinners
};
