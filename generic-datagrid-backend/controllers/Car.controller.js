const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');
const CarService = require('../services/Car.service');

const { Readable } = require('stream');

class CarController {
  async uploadCsv(req, res) {
    try {
      const filePath = path.resolve(__dirname,'../BMW_Aptitude_Test_Test_Data_ElectricCarData.csv');

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'CSV file not found' });
      }

      const cars = [];

      // Read and parse the CSV file
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          cars.push({
            Brand: data.Brand,
            Model: data.Model,
            AccelSec: parseFloat(data.AccelSec),
            TopSpeed_KmH: parseInt(data.TopSpeed_KmH),
            Range_Km: parseInt(data.Range_Km),
            Efficiency_WhKm: parseInt(data.Efficiency_WhKm),
            FastCharge_KmH: data.FastCharge_KmH,
            RapidCharge: data.RapidCharge,
            PowerTrain: data.PowerTrain,
            PlugType: data.PlugType,
            BodyStyle: data.BodyStyle,
            Segment: data.Segment,
            Seats: parseInt(data.Seats),
            PriceEuro: parseFloat(data.PriceEuro),
            Date: data.Date,
          });
        })
        .on('end', async () => {
          // Upload the parsed data
          try {
            await CarService.uploadData(cars);
            res.status(200).json({ message: 'Data uploaded successfully', count: cars.length });
          } catch (uploadError) {
            res.status(500).json({ error: 'Failed to upload data', details: uploadError.message });
          }
        })
        .on('error', (error) => {
          res.status(500).json({ error: 'Failed to parse CSV file', details: error.message });
        });
    } catch (error) {
      res.status(500).json({ error: 'Unexpected error', details: error.message });
    }
  }

  async getAllCars(req, res) {
    try {
      const cars = await CarService.findAll();
      res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cars', details: error.message });
    }
  }


  async searchCars(req, res) {
    try {
      const results = await CarService.search(req.query.q);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async filterCars(req, res) {
    try {
      const { column, criteria, value } = req.query;
  
      // Validate input
       if (!column) {
        return res.status(400).json({ error: 'Column parameter is required' });
      }
      if (!criteria) {
        return res.status(400).json({ error: 'Criteria parameter is required' });
      }
      if (!value && criteria.toLowerCase() !== 'isempty') {
        return res.status(400).json({ error: 'Value parameter is required for non-empty criteria' });
      }

      const results = await CarService.filter({ column, criteria, value });
  
      res.status(200).json(results);
    } catch (error) {
      console.error('Error filtering cars:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
  

  async deleteCar(req, res) {
    try {
      const { id } = req.params;
      await CarService.delete(id);
      res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete car', details: error.message });
    }
  }

  async hello(req, res) {
    res.status(200).json({ message: 'Car ggggggggggggggggggggg successfully' });
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const car = await CarService.findById(id);
      res.json(car);
    } catch (error) {
      res.status(error.message.includes('not found') ? 404 : 500)
        .json({ error: error.message });
    }
  }
}

module.exports = new CarController();