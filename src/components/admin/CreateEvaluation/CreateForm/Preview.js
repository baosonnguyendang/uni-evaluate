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

  useEffect(() => {
    console.log(props.id)
    axios.get(`/admin/form/${props.id}/getFormStandard`)
      .then(res => {
        console.log(res.data)
        setForm(res.data.formStandards)
        res.data.formStandards.map(standard => (
          axios.get(`/admin/form/${props.id}/standard/${standard.standard_id.code}/getFormCriteria`)
            .then(res => {
              console.log(res.data)
            })
            .catch(err => (
              console.log(err)
            ))
        ))
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const PrintComponent = () => {
    return (
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
                <TableCell align="center">Trưởng bộ môn</TableCell>
                <TableCell align="center">Hội đồng nhà trường</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {form.map(standard => (
                <>
                  <TableRow>
                    <TableCell>{standard.standard_order}</TableCell>
                    <TableCell><b>{standard.standard_id.name}</b></TableCell>
                    <TableCell>{standard.standard_point}</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                  </TableRow>

                  {/* {standard.formCriteria.map((criteria, index) => (
                      <>
                        <TableRow>
                          <TableCell rowSpan={criteria.options.length + 1} >{standard.standard_order}.{criteria.criteria_order}</TableCell>
                          <TableCell><b>{criteria.criteria_id.name}</b></TableCell>
                          <TableCell>{criteria.point}</TableCell>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'></TableCell>
                        </TableRow>
                        {criteria.options.map((option, index) => (
                          <TableRow>
                            <TableCell>{option.name}</TableCell>
                            <TableCell>{option.max_point}</TableCell>
                            <TableCell align='center' colSpan={1}></TableCell>
                            <TableCell align='center' colSpan={1}></TableCell>
                            <TableCell align='center' colSpan={1}></TableCell>
                          </TableRow>
                        ))}
                      </>
                    ))} */}
                </>
              ))}
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
    )
  }

  return (
    <div>
      <PrintComponent />
    </div>
  );
}