// src/services/ApiService.ts

import axios from 'axios';

export interface FilterCriteria {
  column: string;
  operation: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'isEmpty';
  value?: string;
}

export interface SearchParams {
  searchQuery?: string;
  filters?: FilterCriteria[];
}

export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  async fetchGridData<T>(endpoint: string, params?: SearchParams): Promise<T[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/${endpoint}`, {
        params: {
          search: params?.searchQuery,
          filters: params?.filters ? JSON.stringify(params.filters) : undefined
        }
      });
      console.log('response', response.data);
      
      return response.data as T[];
    } catch (error) {
      console.error('Error fetching grid data:', error);
      throw error;
    }
  }

  async deleteRecord(endpoint: string, id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${endpoint}/${id}`);
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  }
}
