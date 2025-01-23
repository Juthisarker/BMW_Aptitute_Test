// src/services/ApiService.ts

import axios from 'axios';

export interface FilterCriteria {
  column: string;
  criteria: 'contains' | 'equals' | 'startswith' | 'endswith' | 'isempty';
  value?: string;
}

export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  async fetchGridData<T>(endpoint: string): Promise<T[]> {
    try {
      const url = `${this.baseUrl}/${endpoint}`;
      console.log('Making API request to:', url);
      const response = await axios.get<T[]>(url);
      console.log('API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching grid data:', error);
      throw error;
    }
  }

  async searchData<T>(endpoint: string, searchText: string): Promise<T[]> {
    try {
      const url = `${this.baseUrl}/search`;
      const response = await axios.get<T[]>(url, {
        params: { q: searchText }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching data:', error);
      throw error;
    }
  }

  async filterData<T>(endpoint: string, filter: FilterCriteria): Promise<T[]> {
    try {
      const url = `${this.baseUrl}/filter`;
      const response = await axios.get<T[]>(url, {
        params: filter
      });
      return response.data;
    } catch (error) {
      console.error('Error filtering data:', error);
      throw error;
    }
  }

  async deleteRecord(endpoint: string, id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  }

  async fetchRecordById<T>(endpoint: string, id: string): Promise<T> {
    try {
      const response = await axios.get<T>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching record by ID:', error);
      throw error;
    }
  }
}
