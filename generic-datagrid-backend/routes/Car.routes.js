// src/routes/car.routes.js
const express = require('express');
const CarController = require('../controllers/Car.controller');
const multer = require('multer');

const router = express.Router();

// Routes
//router.post('/upload', upload.single('file'), CarController.uploadCsv);
router.post('/upload', CarController.uploadCsv);
router.get('/allCars', CarController.getAllCars);
router.get('/search', CarController.searchCars);
router.get('/filter', CarController.filterCars);
router.get('/:id', CarController.findById);
router.delete('/:id', CarController.deleteCar);

module.exports = router;
