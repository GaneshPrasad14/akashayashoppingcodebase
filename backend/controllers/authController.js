const Admin = require('../models/Admin');
const { sendTokenResponse } = require('../utils/jwt');

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for admin
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check if password matches
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Send token response
    sendTokenResponse(admin, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Logout admin / clear cookie
// @route   GET /api/auth/logout
// @access  Private
const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Admin logged out successfully'
  });
};

// @desc    Update admin details
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      username: req.body.username,
      email: req.body.email
    };

    const admin = await Admin.findByIdAndUpdate(req.admin._id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('+password');

    // Check current password
    if (!(await admin.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    admin.password = req.body.newPassword;
    await admin.save();

    sendTokenResponse(admin, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  login,
  getMe,
  logout,
  updateDetails,
  updatePassword
};