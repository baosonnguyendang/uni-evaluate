import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Link, useRouteMatch, useParams } from 'react-router-dom';

import { Table, TableHead, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    marginTop: '24px',
    border: '1px solid #f4f4f4'
  },
});

export default function EmployeeList() {
  const classes = useStyles();
  
  const {id1, id2} = useParams()
  const { url } = useRouteMatch()
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get(`/admin/form/${id1}/${id2}/getFormUser`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  })

  const [data, setData] = useState([
    { code: '1234', name: 'A Văn B', unit: 'Bảo vệ', status: true },
    { code: '1235', name: 'A Văn B', unit: 'Lao kông', status: false }
  ])

  return (
    <div style={{marginTop: '24px'}}>
      <Typography component="h3" variant="h5" color="inherit">
        Danh sách các GV/VC đánh giá:
      </Typography>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Mã GV/VC</b></TableCell>
            <TableCell align="center"><b>Tên GV/VC</b></TableCell>
            <TableCell align="center"><b>Bộ môn</b></TableCell>
            <TableCell align="center"><b>Trạng thái</b></TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.code}>
              <TableCell component="th" scope="row">
                {row.code}
              </TableCell>
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="left">{row.unit}</TableCell>
              <TableCell align="center">{row.status ? 'Đã đánh giá' : 'Chưa đánh giá'}</TableCell>
              <TableCell align="center">{row.status && <Link to={`${url}/${row.code}`}>Bấm vào đây để đánh giá GV/VC</Link>}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}