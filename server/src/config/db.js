const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔗 Attempting MongoDB connection...');
    
    // Check if URI is available
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI not found in environment variables');
      console.log('📝 Using mock database mode');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Listen to connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.log('📝 Running in mock database mode - translations will work but won\'t be saved');
    
    // DON'T exit the process in development
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 Exiting due to database failure in production');
      process.exit(1);
    }
  }
};

module.exports = connectDB;