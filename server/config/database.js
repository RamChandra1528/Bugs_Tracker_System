const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`🔌 Port: ${conn.connection.port}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error message:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n🔧 Troubleshooting steps:');
      console.error('1. Make sure MongoDB is running locally on port 27017');
      console.error('2. Or update MONGODB_URI in .env to use MongoDB Atlas');
      console.error('3. Check if MongoDB service is started:');
      console.error('   - Windows: net start MongoDB');
      console.error('   - macOS: brew services start mongodb-community');
      console.error('   - Linux: sudo systemctl start mongod');
    }
    
    console.error('\n📋 Current configuration:');
    console.error('MONGODB_URI:', process.env.MONGODB_URI);
    console.error('NODE_ENV:', process.env.NODE_ENV);
    
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error during MongoDB disconnection:', error);
    process.exit(1);
  }
});

module.exports = connectDB;