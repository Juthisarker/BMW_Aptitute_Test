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

  // async search(searchQuery) {
  //   try {
  //     const searchCriteria = {};
  //     const searchableFields = [
  //       'Brand', 'Model', 'RapidCharge', 'PowerTrain', 
  //       'PlugType', 'BodyStyle', 'Segment'
  //     ];

  //     // If searchQuery is a string, search across all searchable fields
  //     if (typeof searchQuery === 'string' && searchQuery.trim()) {
  //       const searchRegex = new RegExp(searchQuery.trim(), 'i');
  //       searchCriteria.$or = searchableFields.map(field => ({
  //         [field]: searchRegex
  //       }));
  //     } else if (typeof searchQuery === 'object') {
  //       // Handle specific field searches
  //       Object.entries(searchQuery).forEach(([key, value]) => {
  //         if (value && value.trim()) {
  //           if (key === 'minPrice') {
  //             searchCriteria.PriceEuro = { ...searchCriteria.PriceEuro, $gte: parseFloat(value) };
  //           } else if (key === 'maxPrice') {
  //             searchCriteria.PriceEuro = { ...searchCriteria.PriceEuro, $lte: parseFloat(value) };
  //           } else {
  //             searchCriteria[key] = new RegExp(value.trim(), 'i');
  //           }
  //         }
  //       });
  //     }

  //     return await Car.find(searchCriteria);
  //   } catch (error) {
  //     throw new Error(`Failed to search cars: ${error.message}`);
  //   }
  // }

  async search(searchQuery) {
    try {
      // If no search query, return all records
      if (!searchQuery || searchQuery.trim() === '') {
        return await Car.find({});
      }
  
      const searchValue = searchQuery.trim();
      const isNumeric = !isNaN(parseFloat(searchValue));
  
      // Define searchable fields
      const textFields = [
        'Brand', 'Model', 'RapidCharge', 'PowerTrain', 
        'PlugType', 'BodyStyle', 'Segment'
      ];
  
      const numericFields = [
        'PriceEuro', 'AccelSec', 'Range_Km'
      ];
  
      // Build search criteria
      const searchCriteria = {
        $or: [
          // Search text fields
          ...textFields.map(field => ({
            [field]: { $regex: searchValue, $options: 'i' }
          })),
          // Search numeric fields if the search value is a number
          ...(isNumeric ? numericFields.map(field => ({
            [field]: parseFloat(searchValue)
          })) : [])
        ]
      };
  
      return await Car.find(searchCriteria);
    } catch (error) {
      throw new Error(`Failed to search cars: ${error.message}`);
    }
  }

  async filter({ column, criteria, value }) {
    try {
      // Validate column
      if (!column) {
        throw new Error('Column is required for filtering');
      }
      
      const fieldType = Car.schema.paths[column]?.instance;
      
      if (!fieldType) {
        throw new Error(`Invalid column: ${column}`);
      }
  
      // Build the filter object
      const filter = {};

      // Handle empty criteria
     if (criteria === 'isempty') {
        filter[column] = { $in: [null, '', '-'] };
        return await Car.find(filter);
      }

      // Validate value is provided for non-empty criteria
      if (!value && criteria !== 'isempty') {
        throw new Error('Value is required for the specified criteria');
      }
  
        // Handle other criteria
      switch (criteria?.toLowerCase()) {
        case 'contains':
          if (fieldType === 'Number') {
            filter[column] = parseFloat(value);
          } else {
            filter[column] = new RegExp(value, 'i');
          }
          break;
        case 'equals':
          if (fieldType === 'Number') {
            filter[column] = parseFloat(value);
          } else {
            filter[column] = value;
          }
          break;
        case 'startswith':
          if (fieldType === 'Number') {
            throw new Error('startswith criteria is not applicable for numeric fields');
          }
          filter[column] = new RegExp(`^${value}`, 'i');
          break;
        case 'endswith':
          if (fieldType === 'Number') {
            throw new Error('endswith criteria is not applicable for numeric fields');
          }
          filter[column] = new RegExp(`${value}$`, 'i');
          break;
        default:
          throw new Error(`Unknown criteria: ${criteria}`);
      }
      return await Car.find(filter);
    } catch (error) {
      throw new Error(`Failed to filter cars: ${error.message}`);
    }
  }
  

  async delete(id) {
    return Car.findByIdAndDelete(id);
  }

  async findById(id) {
    try {
      const car = await Car.findById(id);
      if (!car) {
        throw new Error('Car not found');
      }
      return car;
    } catch (error) {
      throw new Error(`Error finding car: ${error.message}`);
    }
  }
}

module.exports = new CarService();