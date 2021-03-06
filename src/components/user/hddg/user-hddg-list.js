import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Link, useParams, useRouteMatch } from 'react-router-dom'

import {
  Container, Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  LinearProgress
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
});

export default function CouncilUnitList() {
  const classes = useStyles();
  const { id1 } = useParams()
  const { url } = useRouteMatch()

  const [units, setUnits] = useState(null)

  useEffect(() => {
    axios.get(`/form/${ id1 }/formdepartments/get`)
      .then(res => {
        // console.log(res.data)
        let temp = []
        res.data.formDepartments.map(dep => {
          let obj = {
            name: dep.department_id.name,
            code: dep.department_id.department_code,
            headName: dep.head ? dep.head.lastname + ' ' + dep.head.firstname : null,
            headCode: dep.head ? dep.head.staff_id : null
          }
          temp.push(obj)
        })
        // console.log(temp)
        setUnits(temp)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  if (!units) return <LinearProgress style={{ position: "absolute", width: "100%" }} />
  return (
    <Container>
      <Typography variant="h5" style={{ margin: '24px 0' }}>
        Mã Form: {id1} - Các Đơn vị tham gia đánh giá:
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} >
          <TableHead>
            <TableRow>
              <TableCell><b>Tên Đơn vị</b></TableCell>
              <TableCell align="center"><b>Mã Đơn vị</b></TableCell>
              <TableCell align="left"><b>Tên trưởng Đơn vị</b></TableCell>
              <TableCell align="center"><b>Mã trưởng Đơn vị</b></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {units.map((row) => (
              <TableRow key={row.code}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.code}</TableCell>
                <TableCell align="left">{row.headName}</TableCell>
                <TableCell align="center">{row.headCode}</TableCell>
                <TableCell><Link to={`${ url }/${ row.code }`} >Đánh giá</Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}