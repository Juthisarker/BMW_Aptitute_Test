// // src/components/DataGridComponent.tsx

// import React, { useState, useEffect } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import { Button, TextField, Box } from '@mui/material';
// import { useHistory } from 'react-router-dom';
// import { getData, deleteRow } from '../services/ApiService';

// const DataGridComponent: React.FC = () => {
//   const [rowData, setRowData] = useState<any[]>([]);
//   const [columnDefs, setColumnDefs] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const history = useHistory();

//   const fetchData = async (query: string) => {
//     try {
//       const data = await getData(query);
//       setRowData(data.rows); // Assuming data is an object with a 'rows' array
//       const columns = Object.keys(data.rows[0]).map((key) => ({
//         headerName: key.charAt(0).toUpperCase() + key.slice(1),
//         field: key,
//       }));

//       columns.push({
//         headerName: 'Actions',
//         cellRendererFramework: (params: any) => {
//           return (
//             <Box>
//               <Button
//                 variant="outlined"
//                 onClick={() => handleViewClick(params.data)}
//               >
//                 View
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="error"
//                 onClick={() => handleDeleteClick(params.data.id)}
//                 style={{ marginLeft: 8 }}
//               >
//                 Delete
//               </Button>
//             </Box>
//           );
//         },
//       });

//       setColumnDefs(columns);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value);
//     fetchData(event.target.value);
//   };

//   const handleViewClick = (data: any) => {
//     history.push(`/view/${data.id}`);
//   };

//   const handleDeleteClick = async (id: string) => {
//     try {
//       await deleteRow(id);
//       fetchData(searchQuery); // Refresh data after delete
//     } catch (error) {
//       console.error('Error deleting row:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData(searchQuery);
//   }, [searchQuery]);

//   return (
//     <Box>
//       <TextField
//         label="Search"
//         variant="outlined"
//         fullWidth
//         value={searchQuery}
//         onChange={handleSearchChange}
//         style={{ marginBottom: 20 }}
//       />
//       <div style={{ height: '400px', width: '100%' }}>
//         <AgGridReact
//           columnDefs={columnDefs}
//           rowData={rowData}
//           pagination={true}
//           paginationPageSize={10}
//           domLayout="autoHeight"
//         />
//       </div>
//     </Box>
//   );
// };

// export default DataGridComponent;
