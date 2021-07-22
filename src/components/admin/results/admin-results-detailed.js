import React, { useState, useEffect } from 'react'

import axios from 'axios'

import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, makeStyles, Paper, Grid } from "@material-ui/core";

import { useParams } from 'react-router-dom'

import { useDispatch } from 'react-redux'

import { showModal } from '../../../actions/modalAction'
import Loading from '../../common/Loading'

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function ResultsDetailed() {
  const classes = useStyles();
  const dispatch = useDispatch()
  const { id3 } = useParams()

  const [form, setForm] = useState([]) //load form
  const [data, setData] = useState([]) //đổ dữ liệu đã đánh giá vào form
  const [loading, setLoading] = useState(false)

  const [point, setPoint] = useState(0)
  const [point2, setPoint2] = useState(null)
  const [point3, setPoint3] = useState(null)

  const [info, setInfo] = useState({})

  useEffect(() => {
    setLoading(true)
    const userForm = () => {
      return axios.get(`/admin/userForm/${ id3 }/get`)
        .then(res => {
          // console.log(res.data)
          setInfo({
            name: res.data.user.lastname + ' ' + res.data.user.firstname,
            id: res.data.user.staff_id,
            unit: res.data.department.name,
            form: res.data.form.name
          })
          setForm(res.data.formStandards)
        })
        .catch(err => {
          console.log(err)
        })
    }
    const userFormResult = () => {
      return axios.get(`/admin/userForm/${ id3 }/evaluation/get`)
        .then(res => {
          // console.log(res.data)
          return res
        })
        .catch(err => {
          console.log(err)
        })
    }

    Promise.all([userForm(), userFormResult()])
      .then(re => {
        // console.log(re)
        const res = re[1]
        if (res.data.evaluateForms.length > 0) {
          let total = []
          res.data.evaluateForms.map(level => {
            let arr = []
            level.evaluateCriteria.map(criteria => {
              arr.push({ name: criteria.form_criteria.criteria_id.code, value: criteria.point, details: criteria.details })
            })
            total.push(arr)
          })
          // console.log(total)
          setPoint(res.data.evaluateForms[0].point)
          if (total.length > 1) {
            setPoint2(res.data.evaluateForms[1].point)
          }
          if (total.length > 2) {
            setPoint3(res.data.evaluateForms[2].point)
          }
          setData(total.slice())
        }
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })

  }, [])

  const sendDetails = (criteria, level) => {
    // console.log(level)
    switch (level) {
      case 1:
        return (
          data[0].find(x => x.name == criteria).details ? data[0].find(x => x.name == criteria).details : []
        )
      case 2:
        return (
          data[1].find(x => x.name == criteria).details ? data[1].find(x => x.name == criteria).details : []
        )
      case 3:
        return (
          data[2].find(x => x.name == criteria).details ? data[2].find(x => x.name == criteria).details : []
        )
      default:
        return null
    }
  }
  if (loading) return <Loading open />
  return (
    <div>
      <div>

        <div>
          <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {info != null && (
              <div style={{ display: 'inline-block', width: '90%', paddingRight: '15%' }}>
                <div style={{ display: 'flex', fontSize: '1.125rem', justifyContent: 'space-between' }}>
                  <span><b>Tên: </b>{info.name}</span>
                  <span><b>Mã GV/VC: </b>{info.id}</span>
                  <span><b>Đơn vị: </b>{info.unit}</span>
                </div>
              </div>
            )}
          </div>
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
                  {form.map((standard, i) => (
                    <>
                      <TableRow key={standard._id}>
                        <TableCell>{standard.standard_order}</TableCell>
                        <TableCell><b>{standard.standard_id.name}</b></TableCell>
                        <TableCell>{standard.standard_point}</TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>

                      {standard.formCriteria.map((criteria, index) => (
                        <>
                          <TableRow key={criteria._id}>
                            <TableCell rowSpan={criteria.options.length + 1} >{standard.standard_order}.{criteria.criteria_order}</TableCell>
                            <TableCell><b>{criteria.criteria_id.name}</b></TableCell>
                            <TableCell>{criteria.point}</TableCell>
                            <TableCell align='center'>
                              {/* {criteria.options.length > 0 ? null : (criteria.criteria_id.type != 'checkbox' ? (
                                <input
                                  className='number'
                                  type="number"
                                  style={{ width: '40px', textAlign: 'center' }}
                                  disabled
                                  value={data.length > 0 && data[0].find(y => (y.name == criteria.criteria_id.code)).value}
                                  name={criteria.criteria_id.code + '_1'}
                                />
                              ) : (
                                <input
                                  disabled
                                  type="checkbox"
                                  name={criteria.criteria_id.code + '_1'}
                                  checked={data.length > 0 && data[0].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                  value={criteria.point}
                                />
                              ))} */}
                              {criteria.options.length > 0 ? null : (() => {
                                switch (criteria.criteria_id.type) {
                                  default:
                                    return null
                                  case 'input':
                                    return (
                                      <input
                                        className='number'
                                        type="number"
                                        style={{ width: '40px', textAlign: 'center' }}
                                        disabled
                                        value={data.length > 0 && data[0].find(y => (y.name == criteria.criteria_id.code)).value}
                                        name={criteria.criteria_id.code + '_1'}
                                      />
                                    )
                                  case 'checkbox':
                                    return (
                                      <input
                                        type="checkbox"
                                        disabled
                                        checked={data.length > 0 && data[0].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                        name={criteria.criteria_id.code + '_1'}
                                        value={criteria.point}
                                      />
                                    )
                                  case 'detail':
                                    return (
                                      <input
                                        style={{ width: 40 }}
                                        type='button'
                                        onClick={() => {
                                          dispatch(showModal(data => console.log(data), "DETAIL_MODAL", { disableEdit: true, name: criteria.criteria_id.name, code: criteria.criteria_id.code, max_point: criteria.point ? criteria.point : null, base_point: criteria.base_point, details: sendDetails(criteria.criteria_id.code, 1) }))
                                        }}
                                        value={data[0].find(x => x.name == criteria.criteria_id.code) ? data[0].find(x => x.name == criteria.criteria_id.code).value : 0}
                                        onMouseUp={e => e.target.blur()}
                                      />
                                    )
                                  case 'number':
                                    return (
                                      <div>
                                        <input
                                          style={{ width: 40 }}
                                          type='button'
                                          onClick={() => { dispatch(showModal(data => console.log(data), "TIMES_MODAL", { disableEdit: true, name: criteria.criteria_id.name, code: criteria.criteria_id.code, max_point: criteria.point ? criteria.point : null, base_point: criteria.base_point, details: sendDetails(criteria.criteria_id.code, 1) })) }}
                                          value={data[0].find(x => x.name == criteria.criteria_id.code) ? data[0].find(x => x.name == criteria.criteria_id.code).value : 0}
                                          onMouseUp={e => e.target.blur()}
                                        />
                                      </div>
                                    )
                                }
                              })()}
                            </TableCell>
                            <TableCell align='center'>
                              {criteria.options.length > 0 ? null : (() => {
                                switch (criteria.criteria_id.type) {
                                  default:
                                    return null
                                  case 'input':
                                    return (
                                      <input
                                        className='number'
                                        type="number"
                                        style={{ width: '40px', textAlign: 'center' }}
                                        disabled
                                        value={data.length > 1 && data[1].find(y => (y.name == criteria.criteria_id.code)).value}
                                        name={criteria.criteria_id.code + '_2'}
                                      />
                                    )
                                  case 'checkbox':
                                    return (
                                      <input
                                        type="checkbox"
                                        disabled
                                        checked={data.length > 1 && data[1].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                        name={criteria.criteria_id.code + '_2'}
                                        value={criteria.point}
                                      />
                                    )
                                  case 'detail':
                                    return (
                                      <input
                                        style={{ width: 40 }}
                                        type='button'
                                        onClick={() => {
                                          dispatch(showModal(data => console.log(data), "DETAIL_MODAL", { disableEdit: true, name: criteria.criteria_id.name, code: criteria.criteria_id.code, max_point: criteria.point ? criteria.point : null, base_point: criteria.base_point, details: sendDetails(criteria.criteria_id.code, 2) }))
                                        }}
                                        value={data.length > 1 ? (data[1].find(x => x.name == criteria.criteria_id.code) ? data[1].find(x => x.name == criteria.criteria_id.code).value : 0) : ''}
                                        onMouseUp={e => e.target.blur()}
                                      />
                                    )
                                  case 'number':
                                    return (
                                      <div>
                                        <input
                                          style={{ width: 40 }}
                                          type='button'
                                          onClick={() => { dispatch(showModal(data => console.log(data), "TIMES_MODAL", { disableEdit: true, name: criteria.criteria_id.name, code: criteria.criteria_id.code, max_point: criteria.point ? criteria.point : null, base_point: criteria.base_point, details: sendDetails(criteria.criteria_id.code, 2) })) }}
                                          value={data.length > 1 ? (data[1].find(x => x.name == criteria.criteria_id.code) ? data[1].find(x => x.name == criteria.criteria_id.code).value : 0) : ''}
                                          onMouseUp={e => e.target.blur()}
                                        />
                                      </div>
                                    )
                                }
                              })()}
                            </TableCell>
                            <TableCell align='center'>
                              {criteria.options.length > 0 ? null : (() => {
                                switch (criteria.criteria_id.type) {
                                  default:
                                    return null
                                  case 'input':
                                    return (
                                      <input
                                        className='number'
                                        type="number"
                                        style={{ width: '40px', textAlign: 'center' }}
                                        disabled
                                        value={data.length > 2 && data[2].find(y => (y.name == criteria.criteria_id.code)).value}
                                        name={criteria.criteria_id.code + '_3'}
                                      />
                                    )
                                  case 'checkbox':
                                    return (
                                      <input
                                        type="checkbox"
                                        disabled
                                        checked={data.length > 2 && data[2].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                        name={criteria.criteria_id.code + '_3'}
                                        value={criteria.point}
                                      />
                                    )
                                  case 'detail':
                                    return (
                                      <input
                                        style={{ width: 40 }}
                                        type='button'
                                        onClick={() => {
                                          dispatch(showModal(data => console.log(data), "DETAIL_MODAL", { disableEdit: true, name: criteria.criteria_id.name, code: criteria.criteria_id.code, max_point: criteria.point ? criteria.point : null, base_point: criteria.base_point, details: sendDetails(criteria.criteria_id.code, 3) }))
                                        }}
                                        value={data.length > 2 ? (data[2].find(x => x.name == criteria.criteria_id.code) ? data[2].find(x => x.name == criteria.criteria_id.code).value : 0) : ''}
                                        onMouseUp={e => e.target.blur()}
                                      />
                                    )
                                  case 'number':
                                    return (
                                      <div>
                                        <input
                                          style={{ width: 40 }}
                                          type='button'
                                          onClick={() => { dispatch(showModal(data => console.log(data), "TIMES_MODAL", { disableEdit: true, name: criteria.criteria_id.name, code: criteria.criteria_id.code, max_point: criteria.point ? criteria.point : null, base_point: criteria.base_point, details: sendDetails(criteria.criteria_id.code, 3) })) }}
                                          value={data.length > 2 ? (data[2].find(x => x.name == criteria.criteria_id.code) ? data[2].find(x => x.name == criteria.criteria_id.code).value : 0) : ''}
                                          onMouseUp={e => e.target.blur()}
                                        />
                                      </div>
                                    )
                                }
                              })()}
                            </TableCell>
                          </TableRow>
                          {criteria.options.map((option, index) => (
                            <TableRow key={option._id}>
                              <TableCell>{option.name}</TableCell>
                              <TableCell>{option.max_point}</TableCell>
                              <TableCell align='center' colSpan={1}>
                                <input
                                  type="radio"
                                  disabled
                                  checked={data.length > 0 && data[0].find(y => (y.name == criteria.criteria_id.code && y.value == option.max_point))}
                                  name={criteria.criteria_id.code + '_1'}
                                  value={option.max_point}
                                />
                              </TableCell>
                              <TableCell align='center' colSpan={1}>
                                <input
                                  disabled
                                  type="radio"
                                  checked={data.length > 1 && data[1].find(y => (y.name == criteria.criteria_id.code && y.value == option.max_point))}
                                  name={criteria.criteria_id.code + '_2'}
                                  value={option.max_point}
                                />
                              </TableCell>
                              <TableCell align='center' colSpan={1}>
                                <input
                                  disabled
                                  checked={data.length > 2 && data[2].find(y => (y.name == criteria.criteria_id.code && y.value == option.max_point))}
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
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell><b>Tổng điểm</b></TableCell>
                    <TableCell></TableCell>
                    <TableCell align='center'><h5>{point}</h5></TableCell>
                    <TableCell align='center'><h5>{point2}</h5></TableCell>
                    <TableCell align='center'><h5>{point3}</h5></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </div>
      </div>
      <h5 style={{ marginTop: '30px' }}>Điểm đánh giá: {point3 ? point3 : 'Chưa có'}</h5>
    </div>
  )
}

