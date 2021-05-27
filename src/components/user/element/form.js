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
import { ArrowRightAltOutlined } from '@material-ui/icons';

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

  const [point, setPoint] = useState(0) //điểm tự đánh giá
  const [point2, setPoint2] = useState(0) //điểm trưởng khoa đánh giá
  const [all, setAll] = useState([])
  const [edited, setEdited] = useState(false)
  const [data, setData] = useState([]) //data đầu vào
  const [sent, setSent] = useState([]) //data đầu ra
  const [sent2, setSent2] = useState([]) //data đầu ra lv2
  const [luuTam, setLuuTam] = useState([]) //lưu tạm
  const [disabled, setDisabled] = useState(true) //true thì không lưu tạm được, có chỉnh sửa mới lưu tạm được
  const [disableEdit, setDisableEdit] = useState(props.level > 1 ? true : false) //ấn hoàn thành rồi thì ko lưu được nữa, cấp trên ko sửa bài cấp dưới đc 
  const [disableEdit2, setDisableEdit2] = useState(props.level > 2 ? true : false)

  var variable = props.level === 1 ? id1 : id3

  useEffect(() => {

    //lấy Form
    axios.get(`/form/${variable}/v2`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setData(res.data.formStandards)
        let temp = []
        res.data.formStandards.map(standard => {
          standard.formCriteria.map(criteria => {
            let obj = { name: criteria.criteria_id.code, value: criteria.criteria_id.type == 'radio' ? null : 0 }
            temp.push(obj)
          })
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
    if (loading === false) {
      if (props.level == 1) {
        if (sent.length > 0) {
          sent.map(x => {
            if (x.value != null){
              pts += parseInt(x.value)
            }
          })
        }
        setPoint(pts)
      }
      else {
        all[0].map(x => {
          pts += parseInt(x.value)
        })
        setPoint(pts)
        if (sent2.length > 0) {
          sent2.map(x => {
            pts2 += parseInt(x.value)
          })
          setPoint2(pts2)
        }
        else {
          all[1].map(x => {
            pts2 += parseInt(x.value)
          })
          setPoint2(pts2)
        }
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

  const handleCheck = (event) => {
    // setChecked(event.target.checked);
    let temp = sent.slice()
    temp.find(z => z.name + '_1' == event.target.name).value = event.target.checked ? parseInt(event.target.value) : 0
    setSent(temp)
    compare(temp)
    // console.log('name: ' + event.target.name + ', điểm: ' + event.target.value + ', checked:' + event.target.checked)
  };

  const handleCheck2 = (event) => {
    //console.log(event.target.value, event.target.name)
    let tam = []
    if (edited === false) {
      sent.map(x => {
        tam.push(x)
      })
      setEdited(true)
    }
    else {
      sent2.map(x => {
        tam.push(x)
      })
    }
    tam.find(x => x.name + '_2' == event.target.name).value = event.target.checked ? parseInt(event.target.value) : 0
    setSent2(tam)
    compare(tam)
  };

  const handleCheckRadio = (event) => {
    let temp = sent.slice()
    temp.find(z => z.name + '_1' == event.target.name).value = parseInt(event.target.value)
    setSent(temp)
    compare(temp)
  }

  const handleCheckRadio2 = (event) => {
    //compare(temp2)
    let tam = []
    if (edited === false) {
      sent.map(x => {
        tam.push(x)
      })
      setEdited(true)
    }
    else {
      sent2.map(x => {
        tam.push(x)
      })
    }
    tam.find(x => x.name + '_2' == event.target.name).value = parseInt(event.target.value)
    setSent2(tam)
    compare(tam)
  }

  const sendNude = () => {
    let list = []
    let dataToSend = []
    switch (level) {
      case 1:
        let filter = sent.filter(y => y.value == null)
        if (filter.length > 0) {
          filter.map(x => {
            list.push(x.name)
          })
        }
        dataToSend = sent
        break;
      case 2:
        let filterr = sent2.filter(y => y.value == null)
        if (filterr.length > 0) {
          filterr.map(x => {
            list.push(x.name)
          })
        }
        dataToSend = sent2
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
      let noti = 'Các tiêu chuẩn sau chưa hoàn thành đánh giá:'
      list.map(x => noti += '\n' + x)
      alert(noti)
    }
  }

  const temporary = () => {
    setDisabled(true)
    let dataToSend = []
    switch (props.level) {
      case 1:
        dataToSend = sent
        break;
      case 2:
        dataToSend = sent2
        break;
      default:
        break;
    }
    setLuuTam(sent)
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
    setStatus(true)
  }

  return (
    < >
      {status ? (
        <div >
          { loading ? <LinearProgress style={{ position: "absolute", width: "100%" }} /> : (
            <Container>
              <Grid container justify='center' style={{ marginTop: '30px' }}>
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
                      {data.map(standard => (
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
                                      type="checkbox"
                                      disabled={disableEdit}
                                      defaultChecked={all.length > 0 && all[0].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                      onClick={handleCheck}
                                      name={criteria.criteria_id.code + '_1'}
                                      value={criteria.point} />}
                                </TableCell>
                                <TableCell align='center'>
                                  {props.level > 1 && criteria.options.length == 0 ?
                                    <input
                                      type="checkbox"
                                      disabled={disableEdit2}
                                      defaultChecked={all.length > 1 && all[1].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                      onClick={handleCheck2}
                                      name={criteria.criteria_id.code + '_2'}
                                      value={criteria.point}
                                    />
                                    : null}
                                </TableCell>
                                <TableCell align='center'>
                                  {props.level > 2 && criteria.options.length == 0 ? <input type="checkbox" onChange={null} name={criteria.criteria_id.code + '_' + 2} value={criteria.point} /> : null}
                                </TableCell>
                              </TableRow>
                              {criteria.options.map((option, index) => (
                                <TableRow>
                                  <TableCell>{option.name}</TableCell>
                                  <TableCell>{option.max_point}</TableCell>
                                  <TableCell align='center' colSpan={1}>
                                    <input
                                      onClick={handleCheckRadio}
                                      disabled={disableEdit}
                                      defaultChecked={all.length > 0 && all[0].find(y => (y.name == criteria.criteria_id.code && y.value == option.max_point))}
                                      type="radio"
                                      name={criteria.criteria_id.code + '_1'}
                                      value={option.max_point}
                                    />
                                  </TableCell>
                                  <TableCell align='center' colSpan={1}>
                                    {props.level > 1 ?
                                      <input
                                        onClick={handleCheckRadio2}
                                        type="radio"
                                        disabled={disableEdit2}
                                        defaultChecked={all.length > 1 && all[1].find(y => (y.name == criteria.criteria_id.code && y.value == option.max_point))}
                                        name={criteria.criteria_id.code + '_2'}
                                        value={option.max_point}
                                      /> :
                                      null}
                                  </TableCell>
                                  <TableCell align='center' colSpan={1}>{props.level > 2 ? <input onChange={null} type="radio" name={criteria.criteria_id.code + '_' + props.level} value={option.max_point} /> : null}</TableCell>
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
              <div>
                {
                  <div>
                    <div style={{ marginBottom: '24px' }}>
                      <h5>Tổng điểm tự đánh giá: {point}</h5>
                      <h5>{props.level > 1 && `Tổng điểm trưởng Khoa đánh giá: ${point2}`}</h5>
                    </div>
                    {
                      ((!disableEdit && level == 1) || (level == 2 && !disableEdit2)) &&
                      <div style={{ textAlign: 'center', margin: '24px 0' }}>
                        <Button variant="contained" color="secondary" disabled={disabled} onClick={temporary}>
                          Lưu tạm
                        </Button>
                        <Button variant="contained" color="primary" onClick={sendNude} style={{ marginLeft: '10px' }}>
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

