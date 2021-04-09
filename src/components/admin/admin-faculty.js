import * as React from 'react';

import { DataGrid } from '@material-ui/data-grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Tên Đơn vị', width: 220 },
  { field: 'head', headerName: 'Trưởng Đơn vị', width: 220 },
  {
    field: 'headID',
    headerName: 'ID Trưởng Đơn vị',
    type: 'number',
    width: 180,
  },
];

const rows = [
  { id: 1, name: 'Khoa Máy tính', head: 'Jon', headID: 35 },
  { id: 2, name: 'Khoa Điện - Điện tử', head: 'Cersei', headID: 42 },
  { id: 3, name: 'Khoa Cơ khí', head: 'Jaime', headID: 45 },
  { id: 4, name: 'Phòng Đào tạo', head: 'Arya', headID: 16 },
  { id: 5, name: 'Phòng Y tế', head: 'Daenerys', headID: null },
  { id: 6, name: 'Thư viện', head: null, headID: 150 },
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