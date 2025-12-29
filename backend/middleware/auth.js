const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get admin from token
      const admin = await Admin.findById(decoded.id).select('-password');

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'No admin found with this token'
        });
      }

      if (!admin.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Admin account is deactivated'
        });
      }

      req.admin = admin;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.admin.role} is not authorized to access this route`
      });
    }

    next();
  };
};

// Check if admin is active
const checkActive = async (req, res, next) => {
  if (!req.admin) {
    return next();
  }

  const admin = await Admin.findById(req.admin._id);

  if (admin && !admin.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Admin account has been deactivated'
    });
  }

  next();
};

module.exports = {
  protect,
  authorize,
  checkActive
};