const mongoose = require('mongoose');
require('dotenv').config();
const Car = require('../models/car.model');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Check if cars collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const carsCollectionExists = collections.some(col => col.name === 'cars');

    if (!carsCollectionExists) {
      // Create cars collection if it doesn't exist
      await mongoose.connection.db.createCollection('cars');
      console.log('Cars collection created successfully');
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 