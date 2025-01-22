// app.js
const express = require('express');
const cors = require('cors'); 
const carRoutes = require('./routes/Car.routes');
const connectDB = require('./database/db');
require('./models/car.model');
const app = express();
connectDB();
// Middleware
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); 
// Use the routes
app.use('/api', carRoutes);

module.exports = app;
