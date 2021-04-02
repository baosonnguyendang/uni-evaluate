// import * as React from 'react';
// import { DataGrid } from '@material-ui/data-grid';
// import Button from '@material-ui/core/Button';
// import Paper from '@material-ui/core/Paper';

// const columns = [
//   { field: 'id', headerName: 'ID', width: 70 },
//   { field: 'name', headerName: 'Tên tiêu chuẩn', width: 200 },
//   { field: 'description', headerName: 'Mô tả', width: 350 },
//   {
//     field: 'numOfCriteria',
//     headerName: 'Số tiêu chí',
//     type: 'number',
//     width: 150,
//   },
//   {
//     field: 'point',
//     headerName: 'Tổng điểm',
//     width: 180,
//   },
// ];

// const rows = [
//   { id: 1, name: 'Snow', description: 'Jon', numOfCriteria: 35 },
//   { id: 2, name: 'Lannister', description: 'Cersei', numOfCriteria: 42 },
//   { id: 3, name: 'Lannister', description: 'Jaime', numOfCriteria: 45 },
//   { id: 4, name: 'Stark', description: 'Arya', numOfCriteria: 16 },
// ];

// export default class Criterion extends React.Component {
//   render() {
//     const paper = {
//       height: 400,
//       width: '100%',
//       padding: '5px 10px 10px 10px'
//     };

//     return (
//       <Paper style={paper}>
//         <DataGrid rows={rows} columns={columns} pageSize={10} />
//       </Paper>
//     );
//   }
// }

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { id: 'buttonList', label: 'Thao tác', minWidth: 100, align: 'center' },
  { id: 'id', label: 'Mã\u00a0tiêu\u00a0chuẩn', minWidth: 60, align: 'center' },
  { id: 'name', label: 'Tên\u00a0tiêu\u00a0chuẩn', minWidth: 250 },
  {
    id: 'description',
    label: 'Mô\u00a0tả',
    minWidth: 250,
    // format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'numOfCriteria',
    label: 'Số tiêu chí',
    minWidth: 60,
    align: 'center',
  },
  {
    id: 'point',
    label: 'Tổng điểm',
    minWidth: 60,
    align: 'center',
  },
];

// function createData(name, code, population, size) {
//   const density = population / size;
//   return { name, code, population, size, density };
// }


function createData(id, name, description, numOfCriteria, point) {
  const btn = (
    <div>
      <Button variant="contained" color="primary">
        Primary
      </Button>
      <Button variant="contained" color="secondary">
        Secondary
      </Button>
    </div>
  )
  return { btn, id, name, description, numOfCriteria, point }
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function Criterion() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  )
}