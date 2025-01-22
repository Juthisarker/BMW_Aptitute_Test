import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {GenericDataGrid } from './components/DataGrid/GenericDataGrid';
// import DetailsPage from './components/DetailsPage';
import { ApiService } from './services/api.service';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';

// Register the required modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);
const apiService = new ApiService();

const App: React.FC = () => {
  const [columnDefs, setColumnDefs] = useState<any[]>([]);

  useEffect(() => {
    // Fetch the first row of data to dynamically generate column definitions
    const fetchColumnDefs = async () => {
      try {
        const data = await apiService.fetchGridData<any>('allCars');
        if (data.length > 0) {
          const firstRow = data[0];
          const dynamicColumnDefs = Object.keys(firstRow).map((key) => ({
            headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the column name
            field: key,
          }));
          setColumnDefs(dynamicColumnDefs);
        }
      } catch (error) {
        console.error('Error fetching column definitions:', error);
      }
    };

    fetchColumnDefs();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<GenericDataGrid endpoint="allCars" columnDefs={columnDefs} title="Electric Cars" viewPath={''} />}
        />
        {/* <Route path="/details/:id" element={<DetailsPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
