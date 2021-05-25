import React, { useState, useEffect } from 'react'

import axios from 'axios'

import { LinearProgress, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, makeStyles, Paper, Grid, Radio, Button } from "@material-ui/core";

import { useParams } from 'react-router-dom'

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function ResultsDetailed() {
  const classes = useStyles();
  const token = localStorage.getItem('token')
  const { id3 } = useParams()

  const [form, setForm] = useState([]) //load form
  const [data, setData] = useState([]) //đổ dữ liệu đã đánh giá vào form
  const [loading, setLoading] = useState(false)

  var total = []

  useEffect(() => {
    setLoading(true)
    axios.get(`/admin/userForm/${id3}/get`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setForm(res.data.formStandards)
        let temp = []
        res.data.formStandards.map(standard => {
          standard.formCriteria.map(criteria => {
            let obj = { name: criteria.criteria_id.code, value: criteria.criteria_id.type == 'radio' ? null : 0 }
            temp.push(obj)
          })
        })
        axios.get(`/admin/userForm/${id3}/evaluation/get`, { headers: { "Authorization": `Bearer ${token}` } })
          .then(res => {
            //console.log(res.data.evaluateForms)
            if (res.data.evaluateForms) {
              res.data.evaluateForms.map(level => {
                level.evaluateCriteria.map(criteria => {
                  // console.log(temp.find(x => x.list.some(y => y.name === criteria.form_criteria.criteria_id.code)))
                  temp.find(x => x.name == criteria.form_criteria.criteria_id.code).value = criteria.point
                })
                total.push(temp)
              })
            }
            console.log(total)
            setData(total.slice())
            setLoading(false)
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div>
      <Typography>
        Kết quả
      </Typography>
      <div>
        {loading ? <LinearProgress style={{ position: "absolute", width: "100%" }} /> : (
          <Grid container xs={12} justify='center' style={{ margin: '30px 0px' }}>
            <TableContainer component={Paper} style={{ marginBottom: '30px' }}>
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

                      {standard.formCriteria.map((criteria, index) => (
                        <>
                          <TableRow>
                            <TableCell rowSpan={criteria.options.length + 1} >{standard.standard_order}.{criteria.criteria_order}</TableCell>
                            <TableCell><b>{criteria.criteria_id.name}</b></TableCell>
                            <TableCell>{criteria.point}</TableCell>
                            <TableCell align='center'>
                              {criteria.options.length > 0 ? null :
                                <input
                                  disabled
                                  type="checkbox"
                                  name={criteria.criteria_id.code + '_1'}
                                  checked={data.length > 0 && data[0].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                  value={criteria.point} />}
                            </TableCell>
                            <TableCell align='center'>
                              {criteria.options.length > 0 ? null :
                                <input
                                  disabled
                                  checked={data.length > 1 && data[0].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                  type="checkbox"
                                  name={criteria.criteria_id.code + '_2'}
                                  value={criteria.point} />}
                            </TableCell>
                            <TableCell align='center'>
                              {criteria.options.length > 0 ? null :
                                <input
                                  disabled
                                  checked={data.length > 2 && data[0].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                  type="checkbox"
                                  name={criteria.criteria_id.code + '_3'}
                                  value={criteria.point} />}
                            </TableCell>
                          </TableRow>
                          {criteria.options.map((option, index) => (
                            <TableRow>
                              <TableCell>{option.name}</TableCell>
                              <TableCell>{option.max_point}</TableCell>
                              <TableCell align='center' colSpan={1}>
                                <input
                                  type="radio"
                                  disabled
                                  checked={data.length > 0 && data[0].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                  name={criteria.criteria_id.code + '_1'}
                                  value={option.max_point}
                                />
                              </TableCell>
                              <TableCell align='center' colSpan={1}>
                                <input
                                  disabled
                                  type="radio"
                                  checked={data.length > 1 && data[0].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                  name={criteria.criteria_id.code + '_2'}
                                  value={option.max_point}
                                />
                              </TableCell>
                              <TableCell align='center' colSpan={1}>
                                <input
                                  disabled
                                  checked={data.length > 2 && data[0].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                  type="radio"
                                  name={criteria.criteria_id.code + '_3'}
                                  value={option.max_point}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ))}
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </div>
    </div>
  )
}

