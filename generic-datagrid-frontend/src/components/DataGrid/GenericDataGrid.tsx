import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, FilterModel, GridApi } from 'ag-grid-community';
import {
  CircularProgress,
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import ActionsCellRenderer from './ActionsCellRenderer';
import { ApiService } from '../../services/api.service';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelApiModule } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelApiModule]);

interface GenericDataGridProps {
  endpoint: string;
  columnDefs: ColDef[];
  viewPath: string;
  title?: string;
  sx?: object;
}

interface FilterState {
  column: string;
  criteria: 'contains' | 'equals' | 'startswith' | 'endswith' | 'isempty';
  value: string;
}

const apiService = new ApiService();

export function GenericDataGrid<T>({
  endpoint,
  columnDefs,
  viewPath,
  title,
  sx = {},
}: GenericDataGridProps) {
  const [rowData, setRowData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    column: '',
    criteria: 'contains',
    value: ''
  });

  // Basic column definitions with filter
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: true,
      filterParams: {
        buttons: ['apply', 'reset'],
        closeOnApply: true,
      }
    }),
    []
  );

  const actionsColumn: ColDef = {
    headerName: 'Actions',
    cellRenderer: ActionsCellRenderer,
    cellRendererParams: {
      onDelete: async (id: string) => {
        try {
          await apiService.deleteRecord(endpoint, id);
          setRowData((prev) => prev.filter((row) => (row as any).id !== id));
          loadData();
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
  };

  const finalColumnDefs = useMemo(() => {
    return [
      ...columnDefs.filter((col) => col.field !== '_id') 
      .map(col => ({
        ...col,
        filter: 'agTextColumnFilter',
        filterParams: {
          filterOptions: ['contains', 'equals', 'startsWith', 'endsWith', 'isEmpty'],
         // defaultOption: 'contains',
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          suppressAndOrCondition: true,
        },
      })),
      actionsColumn
    ];
  }, [columnDefs, actionsColumn]);

  // Quick filter function for client-side searching
  const onFilterTextBoxChanged = useCallback(() => {
    if (gridApi) {
      gridApi.setGridOption('quickFilterText', searchText);
    }
  }, [gridApi, searchText]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching data from endpoint:', endpoint);
      const data = await apiService.fetchGridData(endpoint);
      console.log('Setting row data:', data);
      setRowData(data);
      setError(null);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Server-side search
  const handleSearch = useCallback(async (value: string) => {
    try {
      setLoading(true);
      const results = await apiService.searchData(endpoint, value);
      setRowData(results);
    } catch (error) {
      console.error('Error searching data:', error);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Server-side filter
  const handleFilter = useCallback(async () => {
    try {
      setLoading(true);
      const results = await apiService.filterData(endpoint, filterState);
      setRowData(results);
      setFilterAnchorEl(null);
    } catch (error) {
      console.error('Error filtering data:', error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, filterState]);

  const handleFilterMenuOpen = (event: React.MouseEvent) => {
    setFilterAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  // Grid initialization
  const onGridReady = useCallback((params: GridReadyEvent) => {
    console.log('Grid is ready, setting API');
    setGridApi(params.api);
  }, []);

  // Filter changed event handler
  const onFilterChanged = useCallback(() => {
    handleFilter();
  }, [handleFilter]);

  // Load initial data
  useEffect(() => {
    console.log('Loading initial data');
    loadData();
  }, [loadData]);

  // Update grid when data changes
  useEffect(() => {
    if (gridApi && rowData.length > 0) {
      console.log('Updating grid with data:', rowData.length, 'rows');
      gridApi.applyTransaction({ add: rowData });
    }
  }, [gridApi, rowData]);

  const clearSearch = useCallback(() => {
    setSearchText('');
    if (gridApi) {
      gridApi.setGridOption('quickFilterText', '');
      loadData();
    }
  }, [gridApi, loadData]);

  return (
    <Paper elevation={3} sx={{ p: 3, ...sx }}>
      {title && (
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}

      <Box sx={{ mb: 2 }}>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search across all columns..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              handleSearch(e.target.value);
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchText)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchText && (
                    <IconButton size="small" onClick={clearSearch}>
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton size="small" onClick={() => handleSearch(searchText)}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <IconButton onClick={(event: React.MouseEvent) => handleFilterMenuOpen(event)}>
            <FilterListIcon />
          </IconButton>

          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterMenuClose}
          >
            <Box p={2} width={300}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Column</InputLabel>
                <Select
                  value={filterState.column}
                  onChange={(e) => setFilterState(prev => ({ ...prev, column: e.target.value }))}
                >
                  {columnDefs.map(col => (
                    <MenuItem key={col.field} value={col.field}>
                      {col.headerName || col.field}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="dense">
                <InputLabel>Criteria</InputLabel>
                <Select
                  value={filterState.criteria}
                  onChange={(e) => setFilterState(prev => ({
                    ...prev,
                    criteria: e.target.value as FilterState['criteria']
                  }))}
                >
                  <MenuItem value="contains">Contains</MenuItem>
                  <MenuItem value="equals">Equals</MenuItem>
                  <MenuItem value="startswith">Starts with</MenuItem>
                  <MenuItem value="endswith">Ends with</MenuItem>
                  <MenuItem value="isempty">Is Empty</MenuItem>
                </Select>
              </FormControl>

              {filterState.criteria !== 'isempty' && (
                <TextField
                  fullWidth
                  margin="dense"
                  label="Value"
                  value={filterState.value}
                  onChange={(e) => setFilterState(prev => ({ ...prev, value: e.target.value }))}
                />
              )}

              <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                <IconButton onClick={() => {
                  setFilterState({ column: '', criteria: 'contains', value: '' });
                  loadData();
                  handleFilterMenuClose();
                }}>
                  <ClearIcon />
                </IconButton>
                <IconButton onClick={handleFilter}>
                  <SearchIcon />
                </IconButton>
              </Box>
            </Box>
          </Menu>
        </Box>

        {error && (
          <Typography color="error" sx={{ p: 2 }}>
            {error}
          </Typography>
        )}

        <div className="ag-theme-material" style={{ height: '530px', width: '100%' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <AgGridReact
              rowData={rowData}
              columnDefs={finalColumnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              onFilterChanged={onFilterChanged}
              pagination={true}
              paginationAutoPageSize={true}
              theme='legacy'
            />
          )}
        </div>
      </Box>
    </Paper>
  );
}

export default GenericDataGrid;