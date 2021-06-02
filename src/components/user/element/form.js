import React, { useState, useEffect } from 'react'
import {
  TableContainer, Table,
  TableHead, TableRow, TableCell,
  TableBody, makeStyles, Paper, Grid,
  Radio, Button, Checkbox,
  LinearProgress,
  Typography, Container
} from "@material-ui/core";

import axios from 'axios'

import { useParams } from 'react-router-dom'
import DialogConfirm from '../../common/DialogConfirm'

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function FormEvaluation(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(true)
  // const [data, setData] = useState({})
  const token = localStorage.getItem('token')
  const { id1, id3 } = useParams()
  var level = props.level

  const [info, setInfo] = useState(null)
  const [point, setPoint] = useState(0) //điểm tự đánh giá
  const [point2, setPoint2] = useState(0)
  const [point3, setPoint3] = useState(0) //điểm trưởng khoa đánh giá
  const [all, setAll] = useState([])
  const [edited, setEdited] = useState(false)
  const [data, setData] = useState([]) //data đầu vào
  const [sent, setSent] = useState([]) //data đầu ra
  const [sent2, setSent2] = useState([]) //data đầu ra lv2
  const [sent3, setSent3] = useState([]) //data đầu ra lv2
  const [luuTam, setLuuTam] = useState([]) //lưu tạm
  const [disabled, setDisabled] = useState(true) //true thì không lưu tạm được, có chỉnh sửa mới lưu tạm được
  const [disableEdit, setDisableEdit] = useState(props.level > 1 ? true : false) //ấn hoàn thành rồi thì ko lưu được nữa, cấp trên ko sửa bài cấp dưới đc 
  const [disableEdit2, setDisableEdit2] = useState(props.level > 2 ? true : false)
  const [disableEdit3, setDisableEdit3] = useState(false)

  var variable = props.level === 1 ? id1 : id3

  useEffect(() => {

    //lấy Form
    axios.get(`/form/${variable}/v2`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data)
        setInfo({
          name: res.data.user.lastname + ' ' + res.data.user.firstname,
          id: res.data.user.staff_id,
          unit: res.data.department.name
        })
        setData(res.data.formStandards)
        let temp = []
        res.data.formStandards.map(standard => {
          standard.formCriteria.map(criteria => {
            let obj = { name: criteria.criteria_id.code, value: criteria.criteria_id.type != 'radio' ? 0 : null }
            temp.push(obj)
          })
          console.log(temp)
        })
        //lấy dữ liệu đã làm nếu Form đã điền trước đó
        axios.get(`/form/${variable}/evaluation/get`, { headers: { "Authorization": `Bearer ${token}` } })
          .then(res => {
            //console.log(temp)
            console.log(res.data.evaluateForms)
            if (res.data.evaluateForms.length > 0) {
              res.data.evaluateForms[0].evaluateCriteria.map(criteria => {
                temp.find(x => x.name == criteria.form_criteria.criteria_id.code).value = criteria.point
              })
              let d = res.data.evaluateForms
              if (d[0].status === 1) {
                setDisableEdit(true)
              }
              if (d[1] && d[1].status === 1) {
                setDisableEdit2(true)
              }
              if (d[2] && d[2].status === 1) {
                setDisableEdit3(true)
              }
              let list = []
              d.map(level => {
                let inside = []
                level.evaluateCriteria.map(criteria => {
                  //inside.push(temp.find(x => x.name == criteria.form_criteria.criteria_id.code).value = criteria.point)
                  inside.push({ name: criteria.form_criteria.criteria_id.code, value: criteria.point })
                })
                list.push(inside)
              })
              console.log(list)
              setAll([...list])
              setLoading(false)
            }
            else {
              setLoading(false)
            }
            console.log(temp)
            setSent([...temp])
            setLuuTam([...temp])
            console.log('a')
          })
          .catch(err => {
            console.log(err)
            setLoading(false)
          })
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let pts = 0
    let pts2 = 0
    let pts3 = 0
    if (loading === false) {
      if (props.level == 1 || disableEdit) {
        if (sent.length > 0) {
          sent.map(x => {
            if (x.value != null) {
              pts += parseInt(x.value)
            }
          })
        }
        setPoint(pts)
      }
      if (props.level == 2 || (disableEdit2)) {
        let tam = 0
        all[0].map(x => {
          tam += parseInt(x.value)
        })
        setPoint(tam)
        all[1].map(x => {
          pts2 += parseInt(x.value)
        })
        setPoint2(pts2)
        // if (edited == true) {
        //   sent2.map(x => {
        //     pts2 += parseInt(x.value)
        //   })
        //   setPoint2(pts2)
        // }
        // else {
        //   all[1].map(x => {
        //     pts2 += parseInt(x.value)
        //   })
        //   setPoint2(pts2)
        // }
      }
      if (props.level == 3 || disableEdit3) {
        let tam = 0
        all[0].map(x => {
          tam += parseInt(x.value)
        })
        setPoint(tam)
        let tamm = 0
        all[1].map(x => {
          tamm += parseInt(x.value)
        })
        setPoint2(tamm)
        all[2].map(x => {
          pts3 += parseInt(x.value)
        })
        setPoint3(pts3)
      }
    }
  })

  const compare = (x) => {
    if (x != luuTam) {
      setDisabled(false)
    }
    else {
      setDisabled(true)
    }
  }

  const handleInput = (event) => {
    let temp = sent.slice()
    temp.find(z => z.name + '_1' == event.target.name).value = parseInt(event.target.value)
    setSent(temp)
    compare(temp)
    // console.log('name: ' + event.target.name + ', điểm: ' + event.target.value + ', checked:' + event.target.checked)
  };

  const handleCheck = (event) => {
    // setChecked(event.target.checked);
    let temp = sent.slice()
    temp.find(z => z.name + '_1' == event.target.name).value = event.target.checked ? parseInt(event.target.value) : 0
    setSent(temp)
    compare(temp)
    // console.log('name: ' + event.target.name + ', điểm: ' + event.target.value + ', checked:' + event.target.checked)
  };

  const handleInput2 = (event) => {
    //console.log(event.target.value, event.target.name)
    let tam = []
    let tamm = []
    if (edited === false) {
      setEdited(true)
      sent.map(x => {
        tam.push(x)
      })
    }
    else {
      sent2.map(x => {
        tam.push(x)
      })
    }
    all[1].map(x => {
      tamm.push(x)
    })
    tam.find(x => x.name + '_2' == event.target.name).value = parseInt(event.target.value)
    tamm.find(x => x.name + '_2' == event.target.name).value = parseInt(event.target.value)
    setSent2(tam)
    let luu = []
    all.map(x => {
      luu.push(x)
    })
    luu[1] = tamm
    setAll(luu)
    compare(tam)
  };

  const handleInput3 = (event) => {
    let temp = []
    all[2].map(x => {
      temp.push(x)
    })
    temp.find(z => z.name + '_3' == event.target.name).value = parseInt(event.target.value)
    let luu = []
    all.map(x => {
      luu.push(x)
    })
    luu[2] = [...temp]
    setSent3(temp)
    setAll(luu)
    compare(temp)
  }

  const handleCheck2 = (event) => {
    //console.log(event.target.value, event.target.name)
    let tam = []
    let tamm = []
    if (edited === false) {
      setEdited(true)
      sent.map(x => {
        tam.push(x)
      })
    }
    else {
      sent2.map(x => {
        tam.push(x)
      })
    }
    all[1].map(x => {
      tamm.push(x)
    })
    tam.find(x => x.name + '_2' == event.target.name).value = event.target.checked ? parseInt(event.target.value) : 0
    tamm.find(x => x.name + '_2' == event.target.name).value = event.target.checked ? parseInt(event.target.value) : 0
    setSent2(tam)
    let luu = []
    all.map(x => {
      luu.push(x)
    })
    luu[1] = tamm
    setAll(luu)
    compare(tam)
  };

  const handleCheck3 = (event) => {
    let temp = []
    all[2].map(x => {
      temp.push(x)
    })
    temp.find(z => z.name + '_3' == event.target.name).value = event.target.checked ? parseInt(event.target.value) : 0
    let luu = []
    all.map(x => {
      luu.push(x)
    })
    luu[2] = [...temp]
    setSent3(temp)
    setAll(luu)
    compare(temp)
  }

  const handleCheckRadio = (event) => {
    let temp = sent.slice()
    temp.find(z => z.name + '_1' == event.target.name).value = parseInt(event.target.value)
    setSent(temp)
    compare(temp)
  }

  const handleCheckRadio2 = (event) => {
    //compare(temp2)
    let tam = []
    let tamm = []
    if (edited === false) {
      setEdited(true)
      sent.map(x => {
        tam.push(x)
      })
    }
    else {
      sent2.map(x => {
        tam.push(x)
      })
    }
    all[1].map(x => {
      tamm.push(x)
    })
    tam.find(x => x.name + '_2' == event.target.name).value = parseInt(event.target.value)
    tamm.find(x => x.name + '_2' == event.target.name).value = parseInt(event.target.value)
    setSent2(tam)
    let luu = []
    all.map(x => {
      luu.push(x)
    })
    luu[1] = tamm
    setAll(luu)
    compare(tam)
  }

  const handleCheckRadio3 = (event) => {
    let temp = []
    all[2].map(x => {
      temp.push(x)
    })
    temp.find(z => z.name + '_3' == event.target.name).value = parseInt(event.target.value)
    let luu = []
    all.map(x => {
      luu.push(x)
    })
    luu[2] = [...temp]
    setSent3(temp)
    setAll(luu)
    compare(temp)
  }

  const submitForm = () => {
    let list = []
    let dataToSend = []
    switch (level) {
      case 1:
        let filter = sent.filter(y => y.value == null)
        console.log(filter)
        if (filter.length > 0) {
          filter.map(x => {
            list.push(x.name)
          })
        }
        let temp = [...all]
        temp[0] = [...sent]
        setAll([...temp])
        dataToSend = sent
        break;
      case 2:
        let filterr = sent2.filter(y => y.value == null)
        if (filterr.length > 0) {
          filterr.map(x => {
            list.push(x.name)
          })
        }
        dataToSend = all[1]
        break;
      case 3:
        let filterrr = sent3.filter(y => y.value == null)
        if (filterrr.length > 0) {
          filterrr.map(x => {
            list.push(x.name)
          })
        }
        dataToSend = all[2]
        break;
      default:
        break;
    }
    if (list.length === 0) {
      let data = { dataToSend, level }
      console.log(data)
      axios.post(`/form/${variable}/submitForm/v3`, data, { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => {
          setStatus(false)
        })
        .catch(err => {
          alert(err)
        })
    }
    else {
      let noti = 'Các tiêu chuẩn/tiêu chí sau chưa hoàn thành đánh giá:'
      data.map(x => {
        x.formCriteria.map(y => {
          if (list.some(z => z == y.criteria_id.code)) {
            noti += '\n' + x.standard_order + '.' + y.criteria_order
          }
        })
      })

      //list.map(x => noti += '\n' + x)
      alert(noti)
    }
  }

  const temporary = () => {
    setDisabled(true)
    let dataToSend = []
    switch (props.level) {
      case 1:
        dataToSend = sent
        setLuuTam(sent)
        break;
      case 2:
        dataToSend = sent2
        setLuuTam(sent2)
        break;
      case 3:
        dataToSend = sent3
        setLuuTam(sent3)
        break;
      default:
        break;
    }
    let data = { dataToSend, level }
    console.log(data)
    axios.post(`/form/${variable}/saveForm/v2`, data, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }


  const [status, setStatus] = useState(true)//hoàn thành đánh giá thì chuyển qua UI hoàn thành đánh giá

  const again = () => {
    if (level == 1) {
      setDisableEdit(true)
    }
    if (level == 2) {
      setDisableEdit2(true)
    }
    if (level == 3) {
      setDisableEdit3(true)
    }
    setStatus(true)
  }
  // modal submit form
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  const onSubmit = () => {
    setStatusDelete({ open: true, onClick: submitForm })
  }
  return (
    < >
      {status ? (
        <div >
          { loading ? <LinearProgress style={{ position: "absolute", width: "100%" }} /> : (
            <Container>
              <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} text='Không thể chỉnh sửa sau khi hoàn thành bài đánh giá. Bạn đã chắc chắn chưa ? ' />
              {info != null && (
                <div style={{ display: 'flex', fontSize: '1.125rem', justifyContent: 'space-between', marginRight: '20%', marginTop: 30 }}>
                  <span><b>Tên: </b>{info.name}</span>
                  <span><b>Mã GV/VC: </b>{info.id}</span>
                  <span><b>Đơn vị: </b>{info.unit}</span>
                </div>
              )}
              <Grid container justify='center' style={{ marginTop: '30px' }}>
                <TableContainer component={Paper} style={{ marginBottom: '30px' }}>
                  <Table className={classes.table} >
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: '10%' }} rowSpan={2}>Tiêu chuẩn/ Tiêu chí</TableCell>
                        <TableCell rowSpan={2}>Nội dung</TableCell>
                        <TableCell align='center' style={{ width: '15%' }} rowSpan={2}>Điểm quy định</TableCell>
                        <TableCell colSpan={3} align="center" style={{ width: '30%' }}>Điểm đánh giá</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="center">Cá nhân tự chấm</TableCell>
                        <TableCell align="center">Trưởng Đơn vị</TableCell>
                        <TableCell align="center">Hội đồng nhà trường</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map(standard => (
                        <>
                          <TableRow key={standard._id}>
                            <TableCell>{standard.standard_order}</TableCell>
                            <TableCell><b>{standard.standard_id.name}</b></TableCell>
                            <TableCell align='center'>{standard.standard_point}</TableCell>
                            <TableCell />
                            <TableCell />
                            <TableCell />
                          </TableRow>

                          {standard.formCriteria.map((criteria) => (
                            <>
                              <TableRow key={criteria._id}>
                                <TableCell rowSpan={criteria.options.length + 1} >{standard.standard_order}.{criteria.criteria_order}</TableCell>
                                <TableCell><b>{criteria.criteria_id.name}</b></TableCell>
                                <TableCell align='center'>{criteria.point}</TableCell>
                                <TableCell align='center'>
                                  {criteria.options.length > 0 ? null : (criteria.criteria_id.type == 'input' ? (
                                    <input
                                      type="number"
                                      style={{ width: '40px', textAlign: 'center' }}
                                      disabled={disableEdit}
                                      defaultValue={all.length > 0 && all[0].find(y => (y.name == criteria.criteria_id.code)).value}
                                      onChange={handleInput}
                                      name={criteria.criteria_id.code + '_1'}
                                    />
                                  ) : (
                                    <input
                                      type="checkbox"
                                      disabled={disableEdit}
                                      defaultChecked={all.length > 0 && all[0].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                      onChange={handleCheck}
                                      name={criteria.criteria_id.code + '_1'}
                                      value={criteria.point} />
                                  ))}
                                </TableCell>
                                <TableCell align='center'>
                                  {(props.level > 1 || disableEdit2) && criteria.options.length == 0 ? (criteria.criteria_id.type == 'input' ? (
                                    <input
                                      type="number"
                                      style={{ width: '40px', textAlign: 'center' }}
                                      disabled={disableEdit2}
                                      defaultValue={all.length > 1 && all[1].find(y => (y.name == criteria.criteria_id.code)).value}
                                      onChange={handleInput2}
                                      name={criteria.criteria_id.code + '_2'}
                                    />
                                  ) : (
                                    <input
                                      type="checkbox"
                                      disabled={disableEdit2}
                                      defaultChecked={all.length > 1 && all[1].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                      onChange={handleCheck2}
                                      name={criteria.criteria_id.code + '_2'}
                                      value={criteria.point}
                                    />
                                  ))
                                    : null}
                                </TableCell>
                                <TableCell align='center'>
                                  {(props.level > 2 || disableEdit3) && criteria.options.length == 0 ? (criteria.criteria_id.type == 'input' ? (
                                    <input
                                      type="number"
                                      style={{ width: '40px', textAlign: 'center' }}
                                      disabled={disableEdit3}
                                      defaultValue={all.length > 2 && all[2].find(y => (y.name == criteria.criteria_id.code)).value}
                                      onChange={handleInput3}
                                      name={criteria.criteria_id.code + '_3'}
                                    />
                                  ) : (
                                    <input
                                      type="checkbox"
                                      disabled={disableEdit3}
                                      onChange={handleCheck3}
                                      defaultChecked={all.length > 2 && all[2].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                      name={criteria.criteria_id.code + '_3'}
                                      value={criteria.point}
                                    />
                                  ))

                                    : null}
                                </TableCell>
                              </TableRow>
                              {criteria.options.map((option, index) => (
                                <TableRow key={option._id}>
                                  <TableCell>{option.name}</TableCell>
                                  <TableCell align='center' >{option.max_point}</TableCell>
                                  <TableCell align='center' colSpan={1}>
                                    <input
                                      onChange={handleCheckRadio}
                                      disabled={disableEdit}
                                      defaultChecked={all.length > 0 && all[0].find(y => (y.name == criteria.criteria_id.code && y.value == option.max_point))}
                                      type="radio"
                                      name={criteria.criteria_id.code + '_1'}
                                      value={option.max_point}
                                    />
                                  </TableCell>
                                  <TableCell align='center' colSpan={1}>
                                    {(props.level > 1 || disableEdit2) ?
                                      <input
                                        onChange={handleCheckRadio2}
                                        type="radio"
                                        disabled={disableEdit2}
                                        defaultChecked={all.length > 1 && all[1].find(y => (y.name == criteria.criteria_id.code && y.value == option.max_point))}
                                        name={criteria.criteria_id.code + '_2'}
                                        value={option.max_point}
                                      /> :
                                      null}
                                  </TableCell>
                                  <TableCell align='center' colSpan={1}>
                                    {(props.level > 2 || disableEdit3) ?
                                      <input
                                        onChange={handleCheckRadio3}
                                        disabled={disableEdit3}
                                        type="radio"
                                        defaultChecked={all.length > 2 && all[2].find(y => (y.name == criteria.criteria_id.code && y.value == option.max_point))}
                                        name={criteria.criteria_id.code + '_3'}
                                        value={option.max_point}
                                      /> :
                                      null}
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
                        <TableCell align='center'><h5>{props.level > 1 || disableEdit2 ? point2 : null}</h5></TableCell>
                        <TableCell align='center'><h5>{props.level > 2 || disableEdit3 ? point3 : null}</h5></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <div>
                {
                  <div>
                    <div style={{ marginBottom: '24px' }}>
                      {/* <Typography variant="h6">Tổng điểm tự đánh giá: {point}</Typography>
                      <Typography variant="h6">{props.level > 1 && `Tổng điểm trưởng Khoa đánh giá: ${point2}`}</Typography> */}
                      <Typography variant="h6">{disableEdit3 && `Điểm đợt đánh giá: ${point3}`}</Typography>
                    </div>
                    {
                      ((!disableEdit && level == 1) || (level == 2 && !disableEdit2) || (level == 3 && !disableEdit3)) &&
                      <div style={{ textAlign: 'center', margin: '24px 0' }}>
                        <Button variant="contained" color="secondary" disabled={disabled} onClick={temporary}>
                          Lưu tạm
                        </Button>
                        <Button variant="contained" color="primary" onClick={onSubmit} style={{ marginLeft: '10px' }}>
                          Hoàn thành đánh giá
                        </Button>
                      </div>
                    }
                  </div>
                }
              </div>
            </Container>
          )}
        </div>
      ) : (
        <div style={{ marginLeft: '30px' }}>
          <Typography style={{ marginTop: '24px' }}>Bạn đã hoàn thành đánh giá.</Typography>
          <Button color='primary' onClick={() => { again() }}>Xem lại đánh giá</Button>
        </div >
      )}

    </>

  )
}

