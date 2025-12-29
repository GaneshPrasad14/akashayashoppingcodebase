const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items,
      paymentMethod,
      notes
    } = req.body;

    // Validate required fields
    if (!customerName || !customerPhone || !customerEmail || !customerAddress || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(customerPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid Indian phone number'
      });
    }

    // Validate email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Validate address
    if (!customerAddress.street || !customerAddress.city || !customerAddress.state || !customerAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete address details'
      });
    }

    // Validate pincode
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(customerAddress.pincode)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 6-digit pincode'
      });
    }

    // Validate items
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.productId || !item.name || !item.price || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item details'
        });
      }

      // Check if product exists and is active
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.name} is not available`
        });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}. Available: ${product.stock}`
        });
      }

      validatedItems.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      });

      subtotal += item.price * item.quantity;
    }

    // Calculate totals
    const deliveryCharge = subtotal >= 999 ? 0 : 49; // Free delivery above ₹999
    const totalAmount = subtotal + deliveryCharge;

    // Create order
    const orderData = {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      items: validatedItems,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
      notes
    };

    const order = await Order.create(orderData);

    // Send WhatsApp notification
    await sendOrderNotification(order);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: {
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        expectedDelivery: order.expectedDelivery
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      error: error.message
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }
    
    if (req.query.search) {
      query.$or = [
        { customerName: { $regex: req.query.search, $options: 'i' } },
        { customerPhone: { $regex: req.query.search, $options: 'i' } },
        { orderId: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Order status is required'
      });
    }

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    order.orderStatus = status;
    
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    } else if (status === 'Cancelled') {
      order.cancelledAt = new Date();
      order.cancelledReason = reason || 'Order cancelled by admin';
    }

    await order.save();

    // Send status update notification
    await sendStatusUpdateNotification(order, status);

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private
const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'Pending'] }, 1, 0] }
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'Confirmed'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'Delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'Cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// WhatsApp notification function
const sendOrderNotification = async (order) => {
  try {
    const message = `🆕 *NEW ORDER FROM WEBSITE* 🆕

*Order ID:* ${order.orderId}
*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Email:* ${order.customerEmail}

*Items:*
${order.items.map(item => `• ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`).join('\n')}

*Order Total:* ₹${order.totalAmount.toLocaleString()}
*Payment Method:* ${order.paymentMethod}
*Delivery Address:*
${order.customerAddress.street}
${order.customerAddress.city}, ${order.customerAddress.state} - ${order.customerAddress.pincode}
${order.customerAddress.landmark ? `Landmark: ${order.customerAddress.landmark}` : ''}

*Expected Delivery:* ${order.expectedDelivery.toLocaleDateString('en-IN')}
*Order Date:* ${order.orderDate.toLocaleDateString('en-IN')}

${order.notes ? `*Special Instructions:* ${order.notes}` : ''}

Please process this order at your earliest convenience.`;

    // In a real implementation, you would use a WhatsApp Business API
    // For now, we'll just log the message
    console.log('WhatsApp Order Notification:', message);
    
    // You could integrate with services like:
    // - Twilio WhatsApp API
    // - MessageBird
    // - 360dialog
    // - Gupshup
    
  } catch (error) {
    console.error('Error sending order notification:', error);
  }
};

const sendStatusUpdateNotification = async (order, newStatus) => {
  try {
    const message = `📦 *ORDER STATUS UPDATE* 📦

*Order ID:* ${order.orderId}
*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}

*Status:* ${newStatus}
*Updated At:* ${new Date().toLocaleString('en-IN')}

${order.cancelledReason ? `*Reason:* ${order.cancelledReason}` : ''}

Thank you for choosing Akshaya Shopping!`;

    console.log('WhatsApp Status Update:', message);
    
  } catch (error) {
    console.error('Error sending status update notification:', error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
};