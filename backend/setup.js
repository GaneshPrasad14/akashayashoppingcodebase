const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://msarunkal_db_user:MI55JCqRkn4YLRuB@akshayashopping.ezzvehf.mongodb.net/?appName=AkshayaShopping');
    console.log('MongoDB Connected for setup');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Create default admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@akshayashopping.in' });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create new admin
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@akshayashopping.in',
      password: 'msarun.kal@AS',
      role: 'superadmin',
      isActive: true
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@akshayashopping.in');
    console.log('Password: msarun.kal@AS');

  } catch (error) {
    console.error('Error creating admin:', error.message);
  }
};

// Run setup
const runSetup = async () => {
  await connectDB();
  await createAdmin();
  console.log('Setup completed');
  process.exit(0);
};

runSetup();