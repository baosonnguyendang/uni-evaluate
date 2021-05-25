import React, { useState, useEffect } from 'react'
import {
  TableContainer, Table,
  TableHead, TableRow, TableCell,
  TableBody, makeStyles, Paper, Grid,
  Radio, Button, Checkbox,
  LinearProgress,
  Typography
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
  const [loading, setLoading] = useState(false)
  // const [data, setData] = useState({})
  const token = localStorage.getItem('token')
  const { id1, id3 } = useParams()
  var level = props.level

  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState([]) //data đầu vào
  const [sent, setSent] = useState([]) //data đầu ra
  const [sent2, setSent2] = useState([]) //data đầu ra lv2
  const [luuTam, setLuuTam] = useState([]) //lưu tạm
  const [disabled, setDisabled] = useState(true) //true thì không lưu tạm được, có chỉnh sửa mới lưu tạm được
  const [disableEdit, setDisableEdit] = useState(props.level > 1 ? true : false) //ấn hoàn thành rồi thì ko lưu được nữa, cấp trên ko sửa bài cấp dưới đc 

  useEffect(() => {
    setLoaded(true)
    setLoading(true)
    let variable = props.level === 1 ? id1 : id3

    //lấy Form
    axios.get(`/form/${variable}/v2`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setData(res.data.formStandards)
        var temp = []
        res.data.formStandards.map(standard => {
          let o = { name: standard.standard_id.code, list: [] }
          standard.formCriteria.map(criteria => {
            let obj = { name: criteria.criteria_id.code, value: criteria.criteria_id.type == 'radio' ? null : 0 }

            o.list.push(obj)
          })
          temp.push(o)
        })

        //lấy dữ liệu đã làm nếu Form đã điền trước đó
        axios.get(`/form/${variable}/evaluation/get`, { headers: { "Authorization": `Bearer ${token}` } })
          .then(res => {
            //console.log(temp)
            setLoading(false)
            if (res.data.evaluateForms.length > 0) {
              res.data.evaluateForms[0].evaluateCriteria.map(criteria => {
                // console.log(temp.find(x => x.list.some(y => y.name === criteria.form_criteria.criteria_id.code)))
                temp.find(x => x.list.some(y => y.name == criteria.form_criteria.criteria_id.code)).list.find(z => z.name == criteria.form_criteria.criteria_id.code).value = criteria.point
              })
            }
            setSent(temp)
            setLuuTam(temp)
            console.log('a')
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
    console.log(sent)
    setSent2(sent.slice())
  }, [])

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
    temp.find(x => x.list.some(y => y.name + '_1' == event.target.name)).list.find(z => z.name + '_1' == event.target.name).value = event.target.checked ? parseInt(event.target.value) : 0
    setSent(temp)
    compare(temp)
    // console.log('name: ' + event.target.name + ', điểm: ' + event.target.value + ', checked:' + event.target.checked)
  };

  const handleCheck2 = (event) => {
    let temp2 = sent2.slice()
    temp2.find(x => x.list.some(y => y.name + '_2' == event.target.name)).list.find(z => z.name + '_2' == event.target.name).value = event.target.checked ? parseInt(event.target.value) : 0
    setSent2(temp2)
    compare(temp2)
  };

  const handleCheckRadio = (event) => {
    let temp = sent.slice()
    temp.find(x => x.list.some(y => y.name + '_1' == event.target.name)).list.find(z => z.name + '_1' == event.target.name).value = parseInt(event.target.value)
    setSent(temp)
    compare(temp)
  }

  const handleCheckRadio2 = (event) => {
    let temp2 = sent2.slice()
    //console.log(temp2.indexOf(temp2.find(x => x.list.some(y => y.name + '_2' == event.target.name)).list.find(z => z.name + '_2' == event.target.name)))
    // temp2[].value = parseInt(event.target.value)
    //temp2[index1].list[index2].value = parseInt(event.target.value)
    temp2.find(x => x.list.some(y => y.name + '_2' === event.target.name)).list.find(z => z.name + '_2' === event.target.name).value = parseInt(event.target.value)
    setSent2(temp2.slice())
    compare(temp2)

  }

  const sendNude = () => {
    let list = []
    sent.filter(x => x.list.some(y => y.value == null)).map(x => {
      list.push(data.find(y => y.standard_id.code == x.name).standard_id.name)
    })
    if (list.length === 0) {
      let data = { sent, level }
      console.log(data)
      axios.post(`/form/${id1}/submitForm`, data, { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => {
          setStatus(false)
          setDisableEdit(true)
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
    switch(props.level){
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
    axios.post(`/form/${id1}/saveForm`, data, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }


  const [status, setStatus] = useState(true)//hoàn thành đánh giá thì chuyển qua UI hoàn thành đánh giá

  const again = () => {
    setStatus(true)
  }

  return (
    < >
      {status ? (
        <div>
          { loading ? <LinearProgress style={{ position: "absolute", width: "100%" }} /> : (
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
                                    defaultChecked={sent.find(x => x.list.some(y => (y.name == criteria.criteria_id.code && y.value == criteria.point)))}
                                    onChange={handleCheck}
                                    name={criteria.criteria_id.code + '_1'}
                                    value={criteria.point} />}
                              </TableCell>
                              <TableCell align='center'>
                                {props.level > 1 && criteria.options.length == 0 ?
                                  <input
                                    type="checkbox"
                                    defaultChecked={sent.find(x => x.list.some(y => (y.name == criteria.criteria_id.code && y.value == criteria.point)))}
                                    onChange={handleCheck2}
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
                                    onChange={handleCheckRadio}
                                    disabled={disableEdit}
                                    defaultChecked={sent.find(x => x.list.some(y => (y.name == criteria.criteria_id.code && y.value == option.max_point)))}
                                    type="radio"
                                    name={criteria.criteria_id.code + '_1'}
                                    value={option.max_point}
                                  />
                                </TableCell>
                                <TableCell align='center' colSpan={1}>
                                  {props.level > 1 ?
                                    <input
                                      onChange={handleCheckRadio2}
                                      type="radio"
                                      defaultChecked={sent.find(x => x.list.some(y => (y.name == criteria.criteria_id.code && y.value == option.max_point)))}
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
              <div>
                {
                  (!disableEdit || (props.level > 1 && true)) &&
                  <div>
                    <Button variant="contained" color="secondary" disabled={disabled} onClick={temporary}>
                      Lưu tạm
                    </Button>
                    <Button variant="contained" color="primary" onClick={sendNude} style={{ marginLeft: '10px' }}>
                      Hoàn thành đánh giá
                    </Button>
                  </div>
                }
              </div>
            </Grid>
          )}
        </div>
      ) : (
        <div>
          <Typography style={{ marginTop: '24px' }}>Bạn đã hoàn thành đánh giá.</Typography>
          <Button color='primary' onClick={() => { again() }}>Xem lại đánh giá</Button>
        </div >
      )}

    </>

  )
}

