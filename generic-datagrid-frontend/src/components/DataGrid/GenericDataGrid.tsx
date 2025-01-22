import React, { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { Module } from '@ag-grid-community/core';
import { 
    CircularProgress, 
    Paper, 
    Typography, 
    Box,
    TextField,
    IconButton,
    InputAdornment
  } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ActionsCellRenderer from './ActionsCellRenderer';
import { ApiService } from '../../services/api.service';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

const modules = [ClientSideRowModelModule];

interface GenericDataGridProps<T> {
  endpoint: string;
  columnDefs: ColDef[];
  viewPath: string;
  title?: string;
  sx?: object; // Optional prop for custom styles
}

const apiService = new ApiService();

export function GenericDataGrid<T>({
  endpoint,
  columnDefs,
  viewPath,
  title,
  sx = {},
}: GenericDataGridProps<T>) {
  const [rowData, setRowData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
  const [error, setError] = useState<string | null>(null); // Added error state
  const [searchText, setSearchText] = useState('');
  const [gridApi, setGridApi] = useState<any>(null);
  
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const actionsColumn = useMemo<ColDef>(
    () => ({
      headerName: 'Actions',
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: {
        onDelete: async (id: string) => {
          try {
            await apiService.deleteRecord(endpoint, id);
            setRowData((prev) => prev.filter((row) => (row as any).id !== id));
          } catch (deleteError) {
            console.error('Error deleting record:', deleteError);
          }
        },
        viewPath,
      },
      width: 120,
      pinned: 'right',
      sortable: false,
      filter: false,
    }),
    [endpoint, viewPath]
  );

  const finalColumnDefs = useMemo(
    () => [...columnDefs, actionsColumn],
    [columnDefs, actionsColumn]
  );

  const onGridReady = useCallback(
    async (params: GridReadyEvent) => {
        
      setLoading(true);
      setError(null); // Reset error state
      console.log("Grid is ready, attempting to fetch data...");
      try {
        const data = await apiService.fetchGridData<T>(endpoint);
        console.log('Fetched data:', data); 
        setRowData(data);
      } catch (fetchError) {
        console.error('Error loading grid data:', fetchError);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return (
    <Paper elevation={2} sx={{ p: 3, ...sx }}>
      {/* {title && (
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 400,
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      ) : ( */}
        <div
          className="ag-theme-material"
          style={{ height: '600px', width: '100%' }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={finalColumnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            pagination={true}
            paginationAutoPageSize={true}
            theme="legacy" 
          />
        </div>
      {/* )} */}
    </Paper>
  );
}
