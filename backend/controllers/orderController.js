const Razorpay = require('razorpay');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay Order
// @route   POST /api/orders/razorpay-order
// @access  Public
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
      error: error.message
    });
  }
};

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
      notes,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.body;

    // Validate required fields
    if (!customerName || !customerPhone || !customerEmail || !customerAddress || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Verify Payment Signature if Online
    if (paymentMethod === 'Online') {
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Payment details missing'
        });
      }

      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed'
        });
      }
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
      // Basic check
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
      // Note: For online payments, stock might have changed between payment init and completion.
      // Ideally, we reserve stock, but for simplicity, we check again.
      if (product.stock < item.quantity) {
        // Refund logic would go here if payment was already made, but this is a simplified flow.
        // In a real app, strict stock locking is needed.
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
      notes,
      isPaid: paymentMethod === 'Online',
      paymentId: razorpay_payment_id || undefined
    };

    const order = await Order.create(orderData);

    // Update product stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // Send WhatsApp notification
    await sendOrderNotification(order);

    // Send Email to Admin
    const adminMessage = `
      <h1>New Order Received</h1>
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>Order Date:</strong> ${new Date().toLocaleString('en-IN')}</p>
      
      <h2>Customer Details:</h2>
      <p><strong>Name:</strong> ${order.customerName}</p>
      <p><strong>Phone:</strong> ${order.customerPhone}</p>
      <p><strong>Email:</strong> ${order.customerEmail}</p>

      <h2>Payment Details:</h2>
      <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      
      <h2>Shipping Address:</h2>
      <p>
        ${order.customerAddress.street}<br>
        ${order.customerAddress.city}, ${order.customerAddress.state} - ${order.customerAddress.pincode}<br>
        ${order.customerAddress.landmark ? `Landmark: ${order.customerAddress.landmark}` : ''}
      </p>

      <h2>Items:</h2>
      <ul>
        ${order.items.map(item => `<li>${item.name} - ${item.quantity} x ₹${item.price}</li>`).join('')}
      </ul>
    `;

    try {
      await sendEmail({
        email: 'msarun.kal@gmail.com', // Admin email
        subject: `New Order Received - ${order.orderId}`,
        html: adminMessage
      });
    } catch (emailError) {
      console.error('Error sending admin email:', emailError);
    }

    // Send Email to Customer
    const customerMessage = `
      <h1>Order Confirmation</h1>
      <p>Dear ${order.customerName},</p>
      <p>Thank you for your order! We have received your order and are processing it.</p>
      
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>Order Date:</strong> ${new Date().toLocaleString('en-IN')}</p>
      
      <h2>Order Summary:</h2>
      <ul>
        ${order.items.map(item => `<li>${item.name} - ${item.quantity} x ₹${item.price}</li>`).join('')}
      </ul>
      
      <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>

      <h2>Shipping Address:</h2>
      <p>
        ${order.customerAddress.street}<br>
        ${order.customerAddress.city}, ${order.customerAddress.state} - ${order.customerAddress.pincode}<br>
        ${order.customerAddress.landmark ? `Landmark: ${order.customerAddress.landmark}` : ''}
      </p>

      <p>We will notify you once your order is shipped.</p>
      <br>
      <p>For any queries, please contact us at: <strong>+91 99999 99999</strong> or reply to this email.</p>
      <br>
      <p>Best Regards,</p>
      <p>Akshaya Shopping Team</p>
    `;

    try {
      await sendEmail({
        email: customerEmail, // Use the customer's email
        subject: `Order Confirmation - ${order.orderId}`,
        html: customerMessage
      });
    } catch (emailError) {
      console.error('Error sending customer email:', emailError);
    }

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
  createRazorpayOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats
};