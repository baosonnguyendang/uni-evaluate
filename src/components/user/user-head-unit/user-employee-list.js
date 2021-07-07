import React, { useState, useEffect } from 'react';

import axios from 'axios';

import PrintList from './user-print-list'

import { Link, useRouteMatch, useParams } from 'react-router-dom';

import { Table, TableHead, TableBody, TableCell, TableRow, TablePagination, Typography, LinearProgress } from '@material-ui/core';
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

  const { id1, id2 } = useParams()
  const { url } = useRouteMatch()
  const token = localStorage.getItem('token')

  const [data, setData] = useState(null)
  const [info, setInfo] = useState() // tên đvị

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

  useEffect(() => {
    axios.get(`/user/head/${id1}/${id2}/get`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data)
        setInfo(res.data.formDepartment)
        let temp = []
        res.data.formUsers.map(user => {
          let point = [' -', ' -', ' -']
          if (user.evaluateForm) {
            user.evaluateForm.map((x, index) => {
              if (x.point || x.point === 0) {
                point[index] = x.point
              }
            })
          }
          let obj = {
            id: user.evaluateForm ? user.userForm._id : null,
            code: user.user_id.staff_id,
            lname: user.user_id.lastname,
            fname: user.user_id.firstname,
            unit: user.user_id.department.length > 0 ? user.user_id.department[0].name : '',
            status: user.evaluateForm ? user.evaluateForm.length : 0,
            point: point,
            rating: user.userForm ? user.userForm.rating : null
          }
          temp.push(obj)
        })
        console.log(temp)
        setData(temp)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  if (!data)
    return <LinearProgress style={{ position: "absolute", width: "100%" }} />
  return (
    <div style={{ margin: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h3" variant="h5" color="inherit">
          Danh sách các GV/VC đánh giá:
        </Typography>
        <PrintList unit={info} data={data} />
      </div>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Mã GV/VC</b></TableCell>
            <TableCell><b>Tên GV/VC</b></TableCell>
            <TableCell><b>Bộ môn</b></TableCell>
            <TableCell align="center"><b>Điểm thành phần</b></TableCell>
            <TableCell align="center"><b>Xếp loại</b></TableCell>
            <TableCell style={{ minWidth: '200px' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <TableRow key={row.code}>
              <TableCell component="th" scope="row">
                {row.code}
              </TableCell>
              <TableCell align="left">{row.lname + ' ' + row.fname}</TableCell>
              <TableCell align="left">{row.unit}</TableCell>
              <TableCell align="center">{row.point.toString()}</TableCell>
              <TableCell align="center">{row.rating ? row.rating : ''}</TableCell>
              <TableCell align="center" style={{ minWidth: '200px' }}> {row.status > 1 && <Link to={`${url}/${row.id}`}>{row.status == 2 ? 'Đánh giá GV/VC' : 'Xem kết quả đánh giá GV/VC'}</Link>}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  )
}