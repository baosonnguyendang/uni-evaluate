import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  number: {
    textAlign: 'center'
  }
}))

function createData(name, id) {
  return { name, id, link: 'Kết quả' }
}

const CustomTableCell = ({ row, name }) => {
  if (name === 'id') {
    return (
      <TableCell style={{ textAlign: 'center' }}>{row[name]}</TableCell>
    )
  }
  else {
    return (
      <TableCell>
        {name === 'link' ? (<Link to={'/admin/criteria/' + row.id} >{row[name]}</Link>) : (row[name])}
      </TableCell>
    )
  }
};

const rows = [
  createData('Nguyễn Phú Trọng', '1712970'),
  createData('Phạm Minh Chính', '1712971'),
  createData('Nguyễn Xuân Phúc', '1712972'),
  createData('Vương Đình Huệ', '1712973'),
  createData('Vũ Đức Đam', '1712974'),
  createData('Đặng Thị Ngọc Thịnh', '1712975'),
];

export default function Results(props) {
  const classes = useStyles()

  //qua trang
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table" id='table'>
          <TableHead>
            <TableRow style={{ backgroundColor: '#f4f4f4' }}>
              <TableCell align="center">Mã viên chức</TableCell>
              <TableCell>Tên viên chức</TableCell>
              <TableCell ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow key={row.id}>
                  <CustomTableCell {...{ row, name: "id" }} />
                  <CustomTableCell {...{ row, name: "name" }} />
                  <CustomTableCell {...{ row, name: "link" }} />
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  )
}