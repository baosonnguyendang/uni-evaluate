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
  const { id1 } = useParams()
  var level = props.level

  const [data, setData] = useState([]) //data đầu vào
  const [sent, setSent] = useState([]) //data đầu ra
  const [luuTam, setLuuTam] = useState([]) //lưu tạm
  const [disabled, setDisabled] = useState(true) //true thì không lưu tạm được, có chỉnh sửa mới lưu tạm được
  const [disableEdit, setDisableEdit] = useState(false) //ấn hoàn thành rồi thì ko lưu được nữa

  useEffect(() => {
    axios.get('/user', { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data)
      })
    setLoading(true)
    axios.get(`/form/${id1}`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setData(res.data.formStandards)
        console.log(res.data.formStandards)
        setLoading(false)
        let temp = []
        res.data.formStandards.map(standard => {
          let o = { name: standard.standard_id.code, list: [] }
          standard.formCriteria.map(criteria => {
            let obj = { name: criteria.criteria_id.code, value: criteria.criteria_id.type == 'radio' ? null : 0 }
            o.list.push(obj)
          })
          temp.push(o)
        })
        setSent(temp)
        setLuuTam(temp)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
    // let temp = []
    // data.map(standard => {
    //   let o = { name: standard.standard_id.code, list: [] }
    //   standard.formCriteria.map(criteria => {
    //     let obj = { name: criteria.criteria_id.code, value: criteria.criteria_id.type == 'radio' ? null : 0 }
    //     o.list.push(obj)
    //   })
    //   temp.push(o)
    // })
    // setSent(temp)
    console.log(sent)
    console.log(luuTam)
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
    console.log(temp)
    temp.find(x => x.list.some(y => y.name === event.target.name)).list.find(z => z.name === event.target.name).value = event.target.checked ? event.target.value : 0
    setSent(temp)
    compare(temp)
    // console.log('name: ' + event.target.name + ', điểm: ' + event.target.value + ', checked:' + event.target.checked)
  };

  const handleCheckRadio = (event) => {
    let temp = sent.slice()
    console.log(temp)
    temp.find(x => x.list.some(y => y.name === event.target.name)).list.find(z => z.name === event.target.name).value = event.target.value
    setSent(temp)
    compare(temp)
  }

  const sendNude = () => {
    let list = []
    sent.filter(x => x.list.some(y => y.value === null)).map(x => {
      list.push(data.find(y => y.standard_id.code === x.name).standard_id.name)
    })
    console.log(sent)
    if (list.length === 0) {
      var data = {sent, level}
      console.log(data)
      axios.post(`/user/${id1}/submitform`, data, { headers: { "Authorization": `Bearer ${token}` } })
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
    setLuuTam(sent)
    axios.post(`/user/submitForm`, sent, { headers: { "Authorization": `Bearer ${token}` } })
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
                              <TableCell align='center'>{criteria.options.length > 0 ? null : <Checkbox disabled={disableEdit} defaultChecked={sent.find(x => x.list.some(y => (y.name == criteria.criteria_id.code && y.value == criteria.point)))} onChange={handleCheck} name={criteria.criteria_id.code} value={criteria.point} />}</TableCell>
                              <TableCell align='center'>{props.level > 1 && criteria.options.length == 0 ? <Checkbox onChange={handleCheck} name={criteria.criteria_id.code + '_' + props.level} value={criteria.point} /> : null}</TableCell>
                              <TableCell align='center'>{props.level > 2 && criteria.options.length == 0 ? <Checkbox onChange={handleCheck} name={criteria.criteria_id.code + '_' + props.level} value={criteria.point} /> : null}</TableCell>
                            </TableRow>
                            {criteria.options.map((option, index) => (
                              <TableRow>
                                <TableCell>{option.name}</TableCell>
                                <TableCell>{option.max_point}</TableCell>
                                <TableCell align='center' colSpan={1}><input onChange={handleCheckRadio} disabled={disableEdit} defaultChecked={sent.find(x => x.list.some(y => (y.name == criteria.criteria_id.code && y.value == option.max_point)))} type="radio" name={criteria.criteria_id.code} value={option.max_point} /></TableCell>
                                <TableCell align='center' colSpan={1}>{props.level > 1 ? <input onChange={handleCheckRadio} type="radio" name={criteria.criteria_id.code + '_' + props.level} value={option.max_point} /> : null}</TableCell>
                                <TableCell align='center' colSpan={1}>{props.level > 2 ? <input onChange={handleCheckRadio} type="radio" name={criteria.criteria_id.code + '_' + props.level} value={option.max_point} /> : null}</TableCell>
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
                  !disableEdit &&
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

