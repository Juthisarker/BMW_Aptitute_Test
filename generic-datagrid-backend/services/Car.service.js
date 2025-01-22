
const Car = require('../models/car.model');

class CarService {
  async uploadData(cars) {
    try {
      await Car.deleteMany({}); // Clear existing data
      await Car.insertMany(cars); // Insert new data
    } catch (error) {
      throw new Error(`Failed to upload data: ${error.message}`);
    }
  }

  async findAll() {
    return Car.find();
  }

  async search({ brand, model, minPrice, maxPrice }) {
    try {
      const searchCriteria = {};

      // Dynamically build the search query
      if (brand) searchCriteria.Brand = new RegExp(brand, 'i'); // Case-insensitive match for Brand
      if (model) searchCriteria.Model = new RegExp(model, 'i'); // Case-insensitive match for Model
      if (minPrice) searchCriteria.PriceEuro = { ...searchCriteria.PriceEuro, $gte: parseFloat(minPrice) }; // Minimum Price
      if (maxPrice) searchCriteria.PriceEuro = { ...searchCriteria.PriceEuro, $lte: parseFloat(maxPrice) }; // Maximum Price

      return await Car.find(searchCriteria); // Query the database
    } catch (error) {
      throw new Error(`Failed to search cars: ${error.message}`);
    }
  }

  async filter({ column, criteria, value }) {
    try {
      if (!column || !criteria) {
        throw new Error('Column and criteria are required for filtering');
      }

      const filter = {}; // Initialize the filter object

      // Build the filter based on criteria
      switch (criteria.toLowerCase()) {
        case 'contains':
          filter[column] = new RegExp(value, 'i'); // Case-insensitive partial match
          break;
        case 'equals':
          filter[column] = value; // Exact match
          break;
        case 'startswith':
          filter[column] = new RegExp(`^${value}`, 'i'); // Starts with
          break;
        case 'endswith':
          filter[column] = new RegExp(`${value}$`, 'i'); // Ends with
          break;
        case 'isempty':
          filter[column] = { $in: [null, ''] }; // Field is null or an empty string
          break;
        default:
          throw new Error(`Unknown criteria: ${criteria}`);
      }

      // Query the database with the built filter
      return await Car.find(filter);
    } catch (error) {
      throw new Error(`Failed to filter cars: ${error.message}`);
    }
  }
  // async filter({ column, condition, value }) {
  //   const query = {};
  //   switch (condition) {
  //     case 'Contains':
  //       query[column] = { $regex: value, $options: 'i' };
  //       break;
  //     case 'Equals':
  //       query[column] = value;
  //       break;
  //     case 'Starts with':
  //       query[column] = { $regex: `^${value}`, $options: 'i' };
  //       break;
  //     case 'Ends with':
  //       query[column] = { $regex: `${value}$`, $options: 'i' };
  //       break;
  //     case 'IsEmpty':
  //       query[column] = { $exists: false };
  //       break;
  //     default:
  //       throw new Error('Invalid filter condition');
  //   }
  //   return Car.find(query);
  // }

  async delete(id) {
    return Car.findByIdAndDelete(id);
  }
}

module.exports = new CarService();