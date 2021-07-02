import React, { useState, useEffect } from 'react'

import axios from 'axios'

import { Tooltip, IconButton, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Grid, } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility';

import { makeStyles } from '@material-ui/core/styles';

import { useParams } from 'react-router-dom'

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function Preview(props) {
  const classes = useStyles();

  const [form, setForm] = useState([])

  const [done, setDone] = useState(false)

  useEffect(() => {
    console.log(props.standards)
    axios.get(`/admin/form/${props.id}/getReviewForm`)
      .then(res => {
        console.log(res.data)
        setForm(res.data.formStandards)
        setDone(true)
      })
      .catch(err => {
        console.log(err)
      })
    // props.standards.map(standard => {
    //   axios.get(`/admin/form/${props.id}/standard/${standard.code}/getFormCriteria`)
    //     .then(res => {
    //       console.log(res.data)
    //       standard.criteria = res.data.formCriteria
    //     })
    //     .catch(err => (
    //       console.log(err)
    //     ))
    // })
    // console.log(props.standards)
    // setForm([...props.standards])
    // setDone(true)
  }, [])

  return (
    <div>
      <Grid container xs={12} justify='center' style={{ marginTop: '30px' }}>
        <TableContainer component={Paper} >
          <Table className={classes.table} >
            <TableHead>
              <TableRow>
                <TableCell rowSpan={2}>Tiêu chuẩn/ Tiêu chí</TableCell>
                <TableCell rowSpan={2}>Nội dung</TableCell>
                <TableCell rowSpan={2}>Điểm quy định</TableCell>
                <TableCell colSpan={3} align="center">Điểm đánh giá</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Cá nhân tự chấm</TableCell>
                <TableCell align="center">Trưởng Đơn vị</TableCell>
                <TableCell align="center">Hội đồng nhà trường</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {done && form.map(standard => {
                return (
                  (
                    <>
                      <TableRow>
                        <TableCell align='center'>{standard.standard_order}</TableCell>
                        <TableCell><b>{standard.standard_id.name}</b></TableCell>
                        <TableCell align='center'>{standard.standard_point}</TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>
                      {standard.formCriteria && standard.formCriteria.map((criteria, index) => (
                        <>
                          <TableRow>
                            <TableCell align='center' rowSpan={criteria.options.length + 1} >{standard.standard_order}.{criteria.criteria_order}</TableCell>
                            <TableCell><b>{criteria.criteria_id.name}</b></TableCell>
                            <TableCell align='center'>{criteria.point}</TableCell>
                            <TableCell align='center'></TableCell>
                            <TableCell align='center'></TableCell>
                            <TableCell align='center'></TableCell>
                          </TableRow>
                          {criteria.options.map((option, index) => (
                            <TableRow>
                              <TableCell>{option.name}</TableCell>
                              <TableCell align='center'>{option.max_point}</TableCell>
                              <TableCell align='center' colSpan={1}></TableCell>
                              <TableCell align='center' colSpan={1}></TableCell>
                              <TableCell align='center' colSpan={1}></TableCell>
                            </TableRow>
                          ))}
                        </>
                      ))}
                    </>
                  )
                )
              })}
              <TableRow>
                <TableCell></TableCell>
                <TableCell><b>Tổng điểm</b></TableCell>
                <TableCell></TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
}