import React, { useState, useEffect } from 'react';

import { Link, useRouteMatch, useParams } from 'react-router-dom'

import Paper from '@material-ui/core/Paper'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from '@material-ui/core/Typography';

import axios from "axios";

export default function EvaluateSetting(props) {
  const name = props.name
  var { url } = useRouteMatch();
  let { id } = useParams();

  //be to fe
  const [rows, setRows] = React.useState([])
  const token = localStorage.getItem('token')
  const fetchFormType = () => {
    axios.get('/admin/review/formtype', { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data);
        setRows(res.data.formTypeList)
        // setRows(res.data.users.map(user => ({ ...user, department: user.department.map(dep => dep.name).join(", "), isEditMode: false })))
        // setPrevious([...rows])
        // setIsLoading(false)
      })
  }
  useEffect(() => {
    fetchFormType()
  }, [])

  return (
    <div>
      {console.log(rows)}
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        Các nhóm tham gia đánh giá {name}
      </Typography>
      <Paper style={{ marginTop: '24px' }}>
        <Table aria-label="caption table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Mã nhóm</TableCell>
              <TableCell align="left">Thành phần</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow>
                  <TableCell align="center"><Link style={{ color: 'black', textDecoration: 'none' }} to={`${url}/${row.code}`}>{row.code}</Link></TableCell>
                  <TableCell align="left"><Link style={{ color: 'black', textDecoration: 'none' }} to={`${url}/${row.code}`}>{row.name}</Link></TableCell>
                  <TableCell align="left"><Link to={`${url}/${row.code}/results`}>Xem kết quả đánh giá</Link></TableCell>
                </TableRow>
              )
            })}
            {/* <TableRow>
              <TableCell align="center"><Link style={{ color: 'black', textDecoration: 'none' }} to={`${url}/01`}>01</Link></TableCell>
              <TableCell align="left"><Link style={{ color: 'black', textDecoration: 'none' }} to={`${url}/01`}>Giảng viên, Nghiên cứu viên, Kỹ sư phục vụ giảng dạy</Link></TableCell>
              <TableCell align="left"><Link to={`${url}/01/results`}>Xem kết quả đánh giá</Link></TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center"><Link style={{ color: 'black', textDecoration: 'none' }} to={`${url}/02`}>02</Link></TableCell>
              <TableCell align="left"><Link style={{ color: 'black', textDecoration: 'none' }} to={`${url}/02`}>Nhân viên hành chính, kỹ thuật, phục vụ, bảo vệ</Link></TableCell>
              <TableCell align="left">Xem kết quả đánh giá</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center"><Link style={{ color: 'black', textDecoration: 'none' }} to={`${url}/03`}>03</Link></TableCell>
              <TableCell align="left"><Link style={{ color: 'black', textDecoration: 'none' }} to={`${url}/03`}>Viên chức quản lý</Link></TableCell>
              <TableCell align="left">Xem kết quả đánh giá</TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}