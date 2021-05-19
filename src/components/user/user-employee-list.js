import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Link, useRouteMatch, useParams } from 'react-router-dom';

import { Table, TableHead, TableBody, TableCell, TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function EmployeeList() {
  const classes = useStyles();

  const [data, setData] = useState([{code: '1234', name: 'A Văn B', unit: 'Bảo vệ'}])

  return (
    <Table className={classes.table} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Mã nhân viên</TableCell>
          <TableCell align="right">Tên nhân viên</TableCell>
          <TableCell align="right">Bộ môn</TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.code}>
            <TableCell component="th" scope="row">
              {row.code}
            </TableCell>
            <TableCell align="right">{row.name}</TableCell>
            <TableCell align="right">{row.unit}</TableCell>
            <TableCell align="right"><Link>Bấm vào đây để đánh giá GV/VC</Link></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}