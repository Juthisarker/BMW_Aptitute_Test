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
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const searchQuery = q.toLowerCase();
      const cars = await this.getAllCars();
      
      const results = cars.filter(car => {
        return Object.values(car).some(value => 
          String(value).toLowerCase().includes(searchQuery)
        );
      });

      res.json(results);
    } catch (error) {
      console.error('Error searching cars:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async filterCars(req, res) {
    try {
      const { column, criteria, value } = req.query;
      
      if (!column || !criteria) {
        return res.status(400).json({ error: 'Column and criteria are required' });
      }

      const cars = await this.getAllCars();
      
      const results = cars.filter(car => {
        const fieldValue = String(car[column]).toLowerCase();
        const filterValue = value ? value.toLowerCase() : '';

        switch (criteria) {
          case 'contains':
            return fieldValue.includes(filterValue);
          case 'equals':
            return fieldValue === filterValue;
          case 'startswith':
            return fieldValue.startsWith(filterValue);
          case 'endswith':
            return fieldValue.endsWith(filterValue);
          case 'isempty':
            return !fieldValue || fieldValue.trim() === '';
          default:
            return true;
        }
      });

      res.json(results);
    } catch (error) {
      console.error('Error filtering cars:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchCarsOld(req, res) {
    try {
      // Handle both query string search and specific field search
      const searchQuery = req.query.q || req.query;
      const cars = await CarService.search(searchQuery);
      res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search cars', details: error.message });
    }
  }

  async filterCarsOld(req, res) {
    try {
      const { column, criteria, value } = req.query;
      
      // Basic validation
      if (!column) {
        return res.status(400).json({ error: 'Column parameter is required' });
      }
      if (!criteria) {
        return res.status(400).json({ error: 'Criteria parameter is required' });
      }
      if (!value && criteria.toLowerCase() !== 'isempty') {
        return res.status(400).json({ error: 'Value parameter is required for non-empty criteria' });
      }

      const cars = await CarService.filter({ column, criteria, value });
      res.status(200).json(cars);
    } catch (error) {
      // Handle specific error cases
      if (error.message.includes('Invalid column')) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message.includes('not applicable')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to filter cars', details: error.message });
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
}

module.exports = new CarController();