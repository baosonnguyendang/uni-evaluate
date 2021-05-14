import React, { useState, useEffect } from 'react';

import { Link, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
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
  },
  paper: {
    minHeight: 440,
    marginTop: 24,
    position: 'relative',
    padding: '10px'
  },
}))

function createData(name, id, unit) {
  return { name, id, unit, link: 'Kết quả' }
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
  createData('Nguyễn Phú Trọng', '1712970', 'Quốc hội'),
];

const group = 1

export default function ResultsList(props) {
  const classes = useStyles()

  const { id, id1 } = useParams() 

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
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        Đợt {id} - Nhóm {id1}
      </Typography>
      <Paper className={classes.paper}>
        Các đơn vị tham gia đánh giá
      </Paper>
    </div>
  )
}