const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zelis_hiring';

  try {
    // Attempt connecting to the configured MONGO_URI
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✓ Connected to configured MongoDB (${mongoose.connection.host})`);
  } catch (err) {
    console.warn(`! Could not connect to MongoDB at ${mongoUri}: ${err.message}`);
    console.log('⚡ Launching In-Memory MongoDB Server so the platform works instantly out of the box...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`✓ Connected to In-Memory MongoDB at: ${inMemoryUri}`);
    } catch (inMemErr) {
      console.error('Fatal: Failed to start both configured and in-memory MongoDB:', inMemErr.message);
      process.exit(1);
    }
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectDB, disconnectDB };
