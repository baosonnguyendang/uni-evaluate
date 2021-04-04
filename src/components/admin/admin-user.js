import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  paper: {
    // padding: '10px',
    marginTop: '15px'
  },
  b: {
    width: '80px',
    margin: '10px',
    textAlign: 'end',
  }
}));

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'Tên', width: 100 },
  { field: 'lastName', headerName: 'Họ và tên đệm', width: 180 },
  {
    field: 'dob',
    headerName: 'DOB',
    // type: 'number',
    width: 90,
  },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
  // },
  {
    field: 'user',
    headerName: 'Tên đăng nhập',
    width: 180,
  },
  {
    field: 'password',
    headerName: 'Mật khẩu',
    sortable: false,
    width: 180,
  },
  {
    field: 'role',
    headerName: 'Chức vụ',
    width: 120,
  },
  {
    field: 'faculty',
    headerName: 'Khoa/Phòng/Ban',
    width: 180,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', dob: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', dob: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', dob: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', dob: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', dob: null },
  { id: 6, lastName: 'Melisandre', firstName: null, dob: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', dob: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', dob: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', dob: 65 },
];

export default function BasicTable() {
  const classes = useStyles();

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        DANH SÁCH NGƯỜI DÙNG
      </Typography>
      <Paper className={classes.paper}>
        <div>
          <div style={{ textAlign: "right", paddingTop: '5px' }}>
            <Button className={classes.b} variant="contained">Thêm</Button>
            <Button className={classes.b} variant="contained">Xóa</Button>
            <Button className={classes.b} variant="contained">Sửa</Button>
          </div>
          <div style={{ height: 400, width: '100%', padding: '5px 10px 10px 10px' }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
          </div>
        </div>
      </Paper>
    </div>
  );
}