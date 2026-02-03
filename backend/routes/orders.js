const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/', orderController.createOrder);
router.post('/razorpay-order', orderController.createRazorpayOrder);

// Private routes (Admin only)
router.get('/', protect, orderController.getOrders);
router.get('/:id', protect, orderController.getOrder);
router.put('/:id/status', protect, orderController.updateOrderStatus);
router.get('/stats', protect, orderController.getOrderStats);

module.exports = router;