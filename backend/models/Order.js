const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  customerEmail: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  customerAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    },
    landmark: {
      type: String
    }
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryCharge: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'],
    default: 'COD'
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  expectedDelivery: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentId: {
    type: String
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelledReason: {
    type: String
  }
}, {
  timestamps: true
});

// Generate unique order ID
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Find the highest order number for today
    const todayOrders = await this.constructor.find({
      orderId: { $regex: `^AKSHAYA-${year}${month}${day}-` }
    }).sort({ orderId: -1 }).limit(1);
    
    let orderNumber = 1;
    if (todayOrders.length > 0) {
      const lastOrder = todayOrders[0].orderId;
      const lastNumber = parseInt(lastOrder.split('-').pop());
      orderNumber = lastNumber + 1;
    }
    
    this.orderId = `AKSHAYA-${year}${month}${day}-${String(orderNumber).padStart(4, '0')}`;
  }
  next();
});

// Calculate expected delivery date (3-5 business days)
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    const today = new Date();
    const expectedDelivery = new Date(today);
    expectedDelivery.setDate(today.getDate() + 5); // 5 business days
    this.expectedDelivery = expectedDelivery;
  }
  next();
});

// Index for better query performance
orderSchema.index({ orderId: 1 });
orderSchema.index({ customerPhone: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ orderDate: -1 });

module.exports = mongoose.model('Order', orderSchema);