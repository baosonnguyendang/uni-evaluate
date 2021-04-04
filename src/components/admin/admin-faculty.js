import * as React from 'react';

import { DataGrid } from '@material-ui/data-grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Tên Khoa/Phòng ban', width: 220 },
  { field: 'head', headerName: 'Trưởng Khoa/Phòng ban', width: 220 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.getValue('name') || ''} ${params.getValue('head') || ''}`,
  },
];

const rows = [
  { id: 1, name: 'Snow', head: 'Jon', age: 35 },
  { id: 2, name: 'Lannister', head: 'Cersei', age: 42 },
  { id: 3, name: 'Lannister', head: 'Jaime', age: 45 },
  { id: 4, name: 'Stark', head: 'Arya', age: 16 },
  { id: 5, name: 'Targaryen', head: 'Daenerys', age: null },
  { id: 6, name: 'Melisandre', head: null, age: 150 },
  { id: 7, name: 'Clifford', head: 'Ferrara', age: 44 },
  { id: 8, name: 'Frances', head: 'Rossini', age: 36 },
  { id: 9, name: 'Roxie', head: 'Harvey', age: 65 },
];

export default function Faculty() {
  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        DANH SÁCH ĐƠN VỊ
      </Typography>
      <Paper style={{marginTop: '15px'}}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
        </div>
      </Paper>
    </div>
  );
}