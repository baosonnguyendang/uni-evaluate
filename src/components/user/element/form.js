import React, { useState, useEffect } from 'react'
import {
  TableContainer, Table,
  TableHead, TableRow, TableCell,
  TableBody, makeStyles, Paper, Grid,
  Button, IconButton, Tooltip,
  LinearProgress,
  Typography, Container, Box,
} from "@material-ui/core";
import PrintIcon from '@material-ui/icons/Print';

import axios from 'axios';

import PinnedSubheaderList from './print.js'
import './styles.css';

import { useReactToPrint } from 'react-to-print';
import { useParams } from 'react-router-dom'
import DialogConfirm from '../../common/DialogConfirm'
import Loading from '../../common/Loading'
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'

import { showModal } from '../../../actions/modalAction'

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});


export default function FormEvaluation(props) {
  const componentRef = React.useRef();
  const dispatch = useDispatch()
  const classes = useStyles();
  const token = localStorage.getItem('token')
  const [isLoading, setIsLoading] = useState(true)
  // const [data, setData] = useState({})
  const { id, id1, id3 } = useParams()
  var level = props.level

  const [info, setInfo] = useState(null)
  const [point, setPoint] = useState(0) //điểm tự đánh giá
  const [point2, setPoint2] = useState(0)
  const [point3, setPoint3] = useState(0) //điểm trưởng khoa đánh giá
  const [all, setAll] = useState([]) // tất cả dữ liệu về điểm
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
  const [readOnly, setReadOnly] = useState(false)
  const [readOnly2, setReadOnly2] = useState(false)
  const [readOnly3, setReadOnly3] = useState(false)
  const [max, setMax] = useState([]) // lưu điểm tối đa mỗi tiêu chuẩn
  const [input, setInput] = useState([])
  const [importList, setImportList] = useState([]) //lưu các tiêu chí đã imoprt file

  var variable = props.level === 1 ? id1 : id3

  useEffect(() => {
    axios.get(`/user/review/${id}/head`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        if (!res.data.formDepartment.some(x => x.form_id.code == id1 && x.department_id.department_code == 'HDDG')) {
          setDisableEdit3(true)
        }
      })
      .catch(err => {
        console.log(err)
      })
    //lấy Form
    axios.get(`/form/${variable}/v2`)
      .then(res => {
        console.log(res.data)
        setInfo({
          name: res.data.user.lastname + ' ' + res.data.user.firstname,
          id: res.data.user.staff_id,
          unit: res.data.department.name
        })
        setData(res.data.formStandards)
        let temp = []
        let t3mp = []
        let t = []
        res.data.formStandards.map(standard => {
          let list = []
          standard.formCriteria.map(criteria => {
            if (criteria.criteria_id.type == 'input') {
              t.push({ code: criteria.criteria_id.code, point: criteria.point ? criteria.point : null, order: standard.standard_order + '.' + criteria.criteria_order })
            }
            list.push(criteria.criteria_id.code)
            let obj = { name: criteria.criteria_id.code, standard_order: standard.standard_order, value: criteria.criteria_id.type != 'radio' ? 0 : null }
            temp.push(obj)
          })
          t3mp.push({ order: standard.standard_order, max: standard.standard_point ? standard.standard_point : null, list: list })
        })
        setMax(t3mp)
        console.log(t)
        setInput(t)
        //lấy dữ liệu đã làm nếu Form đã điền trước đó
        axios.get(`/form/${variable}/evaluation/get`)
          .then(res => {
            //console.log(temp)
            console.log(res.data.evaluateForms)
            if (res.data.evaluateForms.length > 0) {
              let tam = []
              res.data.evaluateForms[0].evaluateCriteria.map(criteria => {
                if (criteria.read_only == true) {
                  tam.push(criteria.form_criteria.criteria_id.code)
                }
                temp.find(x => x.name == criteria.form_criteria.criteria_id.code).value = criteria.point
                if (criteria.details) {
                  temp.find(x => x.name == criteria.form_criteria.criteria_id.code).details = criteria.details
                }
              })
              setImportList([...tam])
              let d = res.data.evaluateForms
              if (d[0].status === 1) {
                setDisableEdit(true)
                setReadOnly(true)
              }
              if (d[1] && d[1].status === 1) {
                setDisableEdit2(true)
                setReadOnly2(true)
              }
              if (d[2] && d[2].status === 1) {
                setDisableEdit3(true)
                setReadOnly3(true)
              }
              let list = []
              d.map(level => {
                let inside = []
                level.evaluateCriteria.map(criteria => {
                  //inside.push(temp.find(x => x.name == criteria.form_criteria.criteria_id.code).value = criteria.point)
                  if (criteria.details) {
                    inside.push({ name: criteria.form_criteria.criteria_id.code, value: criteria.point, details: criteria.details })
                  } else {
                    inside.push({ name: criteria.form_criteria.criteria_id.code, value: criteria.point })
                  }
                })
                list.push(inside)
              })
              console.log(list)
              setAll([...list])
              setIsLoading(false)
            }
            else {
              setIsLoading(false)
            }
            console.log(temp)
            setSent([...temp])
            setLuuTam([...temp])
            console.log('a')
          })
          .catch(err => {
            console.log(err)
            setIsLoading(false)
          })
      })
      .catch(err => {
        console.log(err)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    let pts = 0
    let pts2 = 0
    let pts3 = 0
    if (isLoading === false) {
      if (props.level == 1 || (disableEdit && props.level < 2)) {
        if (sent.length > 0) {
          max.map(x => {
            let diem = 0
            x.list.map(y => {
              if (sent.find(z => z.name == y).value != null) {
                diem += sent.find(z => z.name == y).value
              }
            })
            if (diem > x.max && x.max != null) {
              diem = x.max
            }
            pts += diem
          })
          // sent.map(x => {
          //   if (x.value != null) {
          //     pts += parseInt(x.value)
          //   }
          // })
        }
        setPoint(pts)
      }
      if (props.level == 2 || (disableEdit2 && props.level < 3)) {
        let tam = 0
        console.log(max)
        max.map(x => {
          let diem = 0
          let diem2 = 0
          x.list.map(y => {
            console.log(y)
            diem += all[0].find(z => z.name == y).value
            diem2 += all[1].find(z => z.name == y).value
          })
          if (diem > x.max && x.max != null) {
            diem = x.max
          }
          if (diem2 > x.max && x.max != null) {
            diem2 = x.max
          }
          tam += diem
          pts2 += diem2
        })
        setPoint(tam)
        // all[1].map(x => {
        //   pts2 += parseInt(x.value)
        // })
        setPoint2(pts2)
      }
      if (props.level == 3 || readOnly3 == true) {
        let tam = 0
        let tamm = 0
        max.map(x => {
          let diem = 0
          let diem2 = 0
          let diem3 = 0
          x.list.map(y => {
            diem += all[0].find(z => z.name == y).value
            diem2 += all[1].find(z => z.name == y).value
            diem3 += all[2].find(z => z.name == y).value
          })
          if (diem > x.max && x.max != null) {
            diem = x.max
          }
          if (diem2 > x.max && x.max != null) {
            diem2 = x.max
          }
          if (diem3 > x.max && x.max != null) {
            diem3 = x.max
          }
          tam += diem
          tamm += diem2
          pts3 += diem3
        })
        setPoint(tam)
        // all[1].map(x => {
        //   pts2 += parseInt(x.value)
        // })
        setPoint2(tamm)
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
    closeDialog()
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

    let loi = ''
    input.map(x => {
      if (dataToSend.find(y => y.name == x.code).value > x.point || dataToSend.find(y => y.name == x.code).value < 0) {
        loi += '\n' + x.order
      }
    })

    if (loi.length > 0) {
      let sai = 'Các tiêu chí sau điền sai:'
      sai += loi
      let b = dataToSend.filter(x => x.value < 0)
      console.log(b)
      data.map(x => {
        x.formCriteria.map(y => {
          if (b.some(z => z.name == y.criteria_id.code)) {
            sai += '\n' + x.standard_order + '.' + y.criteria_order
          }
        })
      })
      alert(sai)
    }
    if (list.length === 0 && !(loi.length > 0)) {
      let dataa = { dataToSend, level }
      console.log(dataa)
      setLoading(true)
      axios.post(`/form/${variable}/submitForm`, dataa)
        .then(res => {
          setStatus(false)
          dispatch(showSuccessSnackbar('Kết quả đánh giá đã lưu'))
          setLoading(false)
        })
        .catch(err => {
          dispatch(showErrorSnackbar('Lưu kết quả đánh giá thất bại'))
          setLoading(false)
          // alert(err)
        })
    }
    else if (list.length > 0) {
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
    let dataa = { dataToSend, level }
    console.log(dataa)

    let loi = ''
    input.map(x => {
      if (dataToSend.find(y => y.name == x.code).value > x.point || dataToSend.find(y => y.name == x.code).value < 0) {
        loi += '\n' + x.order
      }
    })

    if (loi.length > 0) {
      let sai = 'Các tiêu chí sau điền sai:'
      sai += loi
      alert(sai)
    }
    else {
      setLoading(true)
      setDisabled(true)
      console.log(dataa)
      axios.post(`/form/${variable}/saveForm`, dataa)
        .then(res => {
          console.log(res)
          dispatch(showSuccessSnackbar('Lưu tạm thành công'))
          setLoading(false)
        })
        .catch(err => {
          console.log(err)
          dispatch(showErrorSnackbar('Lưu tạm thất bại'))
          setLoading(false)
        })
    }
  }

  const sendDetails = (criteria, level) => {
    console.log(level)
    switch (level) {
      case 1:
        console.log(sent.find(x => x.name == criteria))
        return (
          sent.find(x => x.name == criteria).details ? sent.find(x => x.name == criteria).details : []
        )
      case 2:
        return (
          all[1].find(x => x.name == criteria).details ? all[1].find(x => x.name == criteria).details : []
        )
      case 3:
        return (
          all[2].find(x => x.name == criteria).details ? all[2].find(x => x.name == criteria).details : []
        )
      default:
        return null
    }
  }

  const setDetails = (data, type) => { //hàm này để xử lí cái time_modal và detail_modal
    console.log(data)
    setDisabled(false)
    let t = []
    let temp = []
    switch (props.level) {
      case 1:
        t = [...sent]
        t.find(x => x.name == data.code).value = data.point
        t.find(x => x.name == data.code).details = data.details
        setSent(t)
        break;
      case 2:
        all[1].map(x => {
          temp.push(x)
        })
        temp.find(x => x.name == data.code).value = data.point
        temp.find(x => x.name == data.code).details = data.details
        let luu = []
        all.map(x => {
          luu.push(x)
        })
        luu[1] = [...temp]
        console.log(temp)
        setSent2(temp)
        setAll(luu)
        break;
      case 3:
        all[2].map(x => {
          temp.push(x)
        })
        temp.find(x => x.name == data.code).value = data.point
        temp.find(x => x.name == data.code).details = data.details
        let luuu = []
        all.map(x => {
          luuu.push(x)
        })
        luuu[2] = [...temp]
        console.log(temp)
        setSent3(temp)
        setAll(luuu)
        break;
      default:
        return null
    }
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
    closeDialog()
  }
  // modal submit form
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  const onSubmit = () => {
    setStatusDelete({ open: true, onClick: submitForm })
  }

  const [loading, setLoading] = useState(false)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: info?.id,
  });
  return (
    < >
      {status ? (
        <div ref={componentRef} >
          {isLoading ? <LinearProgress style={{ position: "absolute", width: "100%" }} /> : (
            <Container>
              <Loading open={loading} />
              <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} text='Không thể chỉnh sửa sau khi hoàn thành bài đánh giá. Bạn đã chắc chắn chưa ? ' />
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

                {/* <Tooltip title='In Biểu mẫu' displayPrint="none" component={Box}>
                  <IconButton onClick={handlePrint}>
                    <PrintIcon />
                  </IconButton>
                </Tooltip> */}
                <PinnedSubheaderList userForm={variable} />

              </div>
              <Grid container justify='center' style={{ marginTop: '20px' }}>
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
                                            disabled={disableEdit || readOnly}
                                            defaultValue={all.length > 0 && all[0].find(y => (y.name == criteria.criteria_id.code)).value}
                                            onChange={handleInput}
                                            name={criteria.criteria_id.code + '_1'}
                                          />
                                        )
                                      case 'checkbox':
                                        return (
                                          <input
                                            type="checkbox"
                                            disabled={disableEdit || readOnly}
                                            defaultChecked={all.length > 0 && all[0].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                            onChange={handleCheck}
                                            name={criteria.criteria_id.code + '_1'}
                                            value={criteria.point}
                                          />
                                        )
                                      case 'detail':
                                        return (
                                          <div>
                                            {/* <input
                                              className='number'
                                              type="number"
                                              style={{ width: '40px', textAlign: 'center' }}
                                              disabled={disableEdit || readOnly}
                                              defaultValue={all.length > 0 && all[0].find(y => (y.name == criteria.criteria_id.code)).value}
                                              onChange={handleInput}
                                              name={criteria.criteria_id.code + '_1'}
                                            /> */}
                                            <input
                                              style={{ width: 40 }}
                                              type='button'
                                              onClick={() => {
                                                console.log(disableEdit, readOnly);
                                                dispatch(showModal(data => setDetails(data, 1), "DETAIL_MODAL", { disableEdit: disableEdit || readOnly, name: criteria.criteria_id.name, code: criteria.criteria_id.code, max_point: criteria.point ? criteria.point : null, base_point: criteria.base_point, details: sendDetails(criteria.criteria_id.code, 1) }))
                                              }}
                                              value={sent.find(x => x.name == criteria.criteria_id.code) ? sent.find(x => x.name == criteria.criteria_id.code).value : 0}
                                              onMouseUp={e => e.target.blur()}
                                            />
                                          </div>
                                        )
                                      case 'number':
                                        return (
                                          <div>
                                            {/* <input
                                              className='number'
                                              type="number"
                                              style={{ width: '40px', textAlign: 'center' }}
                                              disabled={disableEdit || readOnly}
                                              defaultValue={all.length > 0 && all[0].find(y => (y.name == criteria.criteria_id.code)).value}
                                              onChange={handleInput}
                                              name={criteria.criteria_id.code + '_1'}
                                            /> */}
                                            <input
                                              style={{ width: 40 }}
                                              type='button'
                                              onClick={() => { dispatch(showModal(data => setDetails(data, 2), "TIMES_MODAL", { disableEdit: disableEdit || readOnly || importList.some(x => x == criteria.criteria_id.code), name: criteria.criteria_id.name, code: criteria.criteria_id.code, max_point: criteria.point ? criteria.point : null, base_point: criteria.base_point, details: sendDetails(criteria.criteria_id.code, 1) })) }}
                                              value={sent.find(x => x.name == criteria.criteria_id.code) ? sent.find(x => x.name == criteria.criteria_id.code).value : 0}
                                              onMouseUp={e => e.target.blur()}
                                            />
                                          </div>
                                        )
                                    }
                                  })()}
                                </TableCell>
                                <TableCell align='center'>
                                  {(props.level > 1 || readOnly2) && criteria.options.length == 0 ? (() => {
                                    switch (criteria.criteria_id.type) {
                                      default:
                                        return null
                                      case 'input':
                                        return (
                                          <input
                                            type="number"
                                            className='number'
                                            style={{ width: '40px', textAlign: 'center' }}
                                            disabled={disableEdit2 || readOnly2}
                                            defaultValue={all.length > 1 && all[1].find(y => (y.name == criteria.criteria_id.code)).value}
                                            onChange={handleInput2}
                                            name={criteria.criteria_id.code + '_2'}
                                          />
                                        )
                                      case 'checkbox':
                                        return (
                                          <input
                                            type="checkbox"
                                            disabled={disableEdit2 || readOnly2}
                                            defaultChecked={all.length > 1 && all[1].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                            onChange={handleCheck2}
                                            name={criteria.criteria_id.code + '_2'}
                                            value={criteria.point}
                                          />
                                        )
                                      case 'detail':
                                        return (
                                          <div>
                                            <input
                                              style={{ width: 40 }}
                                              type='button'
                                              onClick={() => {
                                                dispatch(showModal(data => setDetails(data, 1), "DETAIL_MODAL", { disableEdit: disableEdit2 || readOnly2, name: criteria.criteria_id.name, code: criteria.criteria_id.code, max_point: criteria.point ? criteria.point : null, base_point: criteria.base_point, details: sendDetails(criteria.criteria_id.code, 2) }))
                                              }}
                                              value={all[1].find(y => (y.name == criteria.criteria_id.code)) ? all[1].find(y => (y.name == criteria.criteria_id.code)).value : 0}
                                              onMouseUp={e => e.target.blur()}
                                            />
                                          </div>
                                        )
                                      case 'number':
                                        return (
                                          <div>
                                            <input
                                              style={{ width: 40 }}
                                              type='button'
                                              onClick={() => {
                                                dispatch(showModal(data => setDetails(data, 2), "TIMES_MODAL", { disableEdit: disableEdit2 || readOnly2 || importList.some(x => x == criteria.criteria_id.code), name: criteria.criteria_id.name, code: criteria.criteria_id.code, max_point: criteria.point ? criteria.point : null, base_point: criteria.base_point, details: sendDetails(criteria.criteria_id.code, 2) }))
                                              }}
                                              value={all[1].find(y => (y.name == criteria.criteria_id.code)) ? all[1].find(y => (y.name == criteria.criteria_id.code)).value : 0}
                                              onMouseUp={e => e.target.blur()}
                                            />
                                          </div>
                                        )
                                    }
                                  })() : null}
                                </TableCell>
                                <TableCell align='center'>
                                  {(props.level > 2 || readOnly3) && criteria.options.length == 0 ? (() => {
                                    switch (criteria.criteria_id.type) {
                                      default:
                                        return null
                                      case 'input':
                                        return (
                                          <input
                                            type="number"
                                            className='number'
                                            style={{ width: '40px', textAlign: 'center' }}
                                            disabled={disableEdit3 || readOnly3}
                                            defaultValue={all.length > 2 && all[2].find(y => (y.name == criteria.criteria_id.code)).value}
                                            onChange={handleInput3}
                                            name={criteria.criteria_id.code + '_3'}
                                          />
                                        )
                                      case 'checkbox':
                                        return (
                                          <input
                                            type="checkbox"
                                            disabled={disableEdit3 || readOnly3}
                                            onChange={handleCheck3}
                                            defaultChecked={all.length > 2 && all[2].find(y => (y.name == criteria.criteria_id.code && y.value == criteria.point))}
                                            name={criteria.criteria_id.code + '_3'}
                                            value={criteria.point}
                                          />
                                        )
                                      case 'detail':
                                        return (
                                          <div>
                                            <input
                                              style={{ width: 40 }}
                                              type='button'
                                              onClick={() => {
                                                dispatch(showModal(data => setDetails(data, 1), "DETAIL_MODAL", { disableEdit: disableEdit3 || readOnly3, name: criteria.criteria_id.name, code: criteria.criteria_id.code, max_point: criteria.point ? criteria.point : null, base_point: criteria.base_point, details: sendDetails(criteria.criteria_id.code, 3) }))
                                              }}
                                              value={all.length > 2 && all[2].find(y => (y.name == criteria.criteria_id.code)).value}
                                              onMouseUp={e => e.target.blur()}
                                            />
                                          </div>
                                        )
                                      case 'number':
                                        return (
                                          <div>
                                            <input
                                              style={{ width: 40 }}
                                              type='button'
                                              onClick={() => {
                                                dispatch(showModal(data => setDetails(data, 2), "TIMES_MODAL", { disableEdit: disableEdit3 || readOnly3 || importList.some(x => x == criteria.criteria_id.code), name: criteria.criteria_id.name, code: criteria.criteria_id.code, max_point: criteria.point ? criteria.point : null, base_point: criteria.base_point, details: sendDetails(criteria.criteria_id.code, 3) }))
                                              }}
                                              value={all.length > 2 && all[2].find(y => (y.name == criteria.criteria_id.code)).value}
                                              onMouseUp={e => e.target.blur()}
                                            />
                                          </div>
                                        )
                                    }
                                  })() : null}
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
                                    {(props.level > 1 || readOnly2) ?
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
                                    {(props.level > 2 || readOnly3) ?
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
                        <TableCell align='center'><Typography >{Number((point).toFixed(2))}</Typography></TableCell>
                        <TableCell align='center'><Typography variant="subtitle1">{props.level > 1 || readOnly2 ? Number((point2).toFixed(2)) : null}</Typography></TableCell>
                        <TableCell align='center'><Typography variant="subtitle1">{props.level > 2 || readOnly3 ? Number((point3).toFixed(2)) : null}</Typography></TableCell>
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

