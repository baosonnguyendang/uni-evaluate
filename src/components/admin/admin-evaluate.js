import React, { useState, useEffect } from 'react';
import axios from "axios";
import moment from 'moment'

import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { Link } from 'react-router-dom';

import Skeleton from '../common/skeleton';

import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Toast from '../common/snackbar'
import Loading from '../common/Loading'

import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

function ListItem(props) {
  return (
    // <li>{props.id}</li>
    <tr>
      <td style={{ lineHeight: '50px', paddingLeft: 10 }}><Link to={'/admin/evaluate-settings/' + props.id}>{props.value}</Link></td>
      <td style={{ textAlign: 'center', lineHeight: '50px' }}>{props.id}</td>
      <td style={{ textAlign: 'center', lineHeight: '50px' }}>{props.description}</td>
      <td align='center'>{props.start.toString()}</td>
      <td align='center'>{props.end.toString()}</td>
    </tr>
  )
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((item) =>
    // Correct! Key should be specified inside the array.
    // <Link to={'/admin/evaluate-settings/' + item.id}>
    <ListItem key={item.code} id={item.code}
      value={item.name}
      start={moment(item.start_date).format("HH:mm DD/MM/yyyy")}
      end={moment(item.end_date).format("HH:mm DD/MM/yyyy")}
      description={props.description}
    />
    //</Link>
  );
  return (
    <table style={{ width: '100%', marginBottom: 10 }}>
      <thead style={{ backgroundColor: '#f4f4f4', lineHeight: '50px' }}>
        <tr>
          <th style={{ width: '20%', paddingLeft: 10 }}>Tên đợt đánh giá</th>
          <th style={{ textAlign: 'center', }}>Mã đợt</th>
          <th style={{ width: '30%', textAlign: 'center', }}>Mô tả</th>
          <th style={{ textAlign: 'center' }}>Ngày bắt đầu</th>
          <th style={{ textAlign: 'center' }}>Ngày kết thúc</th>
        </tr>
      </thead>
      <tbody>
        {listItems}
      </tbody>
    </table>
  );
}

//create modal

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: '15px',
    overflowX: "auto"
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper1: {
    position: 'absolute',
    // padding: '10px',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  btn: {
    marginRight: 5,
    minWidth: 180,
  },
}));

export default function EvaluateList() {
  const classes = useStyles();
  //open modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //date picker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  //new Evaluation
  const [number, setNumber] = useState(null);

  //fe to be
  const token = localStorage.getItem('token')
  const fetchReview = () => {
    axios.get('/admin/review/', { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data.reviews);
        setNumber(res.data.reviews)
        setLoading(false)
        // setRows(res.data.users.map(user => ({ ...user, department: user.department.map(dep => dep.name).join(", "), isEditMode: false })))
        // setPrevious([...rows])
        // setIsLoading(false)
      })
  }
  useEffect(() => {
    fetchReview()
  }, [])

  const [evaluationName, setName] = useState('')
  const [id, setId] = useState('')
  const [description, setDescription] = useState('')

  const submit = e => {
    // const date = ["18:30 11/05/2098", "18:30 11/05/2078", "18:30 11/05/2088"]
    // console.log(date.sort((a, b) => moment(a).diff(moment(b))))
    // console.log(moment(startDate, "HH:mm DD/MM/yyyy"))

    // console.log((startDate).format("HH:mm DD/MM/yyyy"))
    // console.log(moment(endDate)._i)
    e.preventDefault()
    setLoading(true)
    handleClose()
    axios.post('/admin/review/add', { code: id, name: evaluationName, start_date: startDate.toString(), end_date: endDate.toString(), description }, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data)
        setNumber(number => [...number, { code: id, name: evaluationName, start_date: moment(startDate).toString(), end_date: moment(endDate).toString(), description }])
        setToast({ open: true, time: 3000, message: 'Tạo đợt đánh giá thành công', severity: "success" })
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            setToast({ open: true, time: 3000, message: 'Mã đợt đánh giá đã tồn tại', severity: "error" })
            break;
          default:
            setToast({ open: true, time: 3000, message: 'Tạo đợt đánh giá thất bại', severity: "error" })
            break;
        }
        setLoading(false)
      })

    // // useEffect
    // console.log(number)
    // console.log(listEvaluate)
  }
  // loading thêm đợt
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ open: false, time: 3000, message: '', severity: '' })
  const handleCloseToast = () => setToast({ ...toast, open: false })
  
  return (
    <>
      { !number ? <Skeleton /> : <div>
        <Toast toast={toast} handleClose={handleCloseToast} />
        <Loading open={loading} />
        <Typography component="h1" variant="h5" color="inherit" noWrap>
          DANH SÁCH ĐỢT ĐÁNH GIÁ
      </Typography>
        <Paper className={classes.paper}>
          <NumberList numbers={number} />
          <div style={{margin: 10, justifyContent:'space-between', display: 'flex' }}>
              <Button variant="contained" className={classes.btn} onClick={handleOpen}>
                Khôi phục
              </Button>
          <Button variant="contained" color='primary' type="button" onClick={handleOpen}>Thêm đợt đánh giá</Button>
          </div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div className={classes.paper1}>
                <Typography variant='h5' gutterBottom id="transition-modal-title">Thêm đợt đánh giá</Typography>
                <form onSubmit={submit}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="evaluateName"
                    label="Mã đợt đánh giá"
                    autoFocus
                    onChange={e => setId(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="evaluateName"
                    label="Tên đợt đánh giá"
                    onChange={e => setName(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="evaluateName"
                    label="Mô tả"
                    onChange={e => setDescription(e.target.value)}
                  />
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDateTimePicker
                      ampm={false}
                      label="Bắt đầu"
                      value={startDate}
                      onChange={setStartDate}
                      onError={console.log}
                      disablePast
                      disableToolbar
                      format="HH:mm DD/MM/yyyy"
                      invalidDateMessage='Thời gian không hợp lệ'
                      fullWidth
                      margin="normal"
                    />
                    <KeyboardDateTimePicker
                      ampm={false}
                      label="Kết thúc"
                      value={endDate}
                      onChange={setEndDate}
                      onError={console.log}
                      disablePast
                      disableToolbar
                      format="HH:mm DD/MM/yyyy"
                      invalidDateMessage='Thời gian không hợp lệ'
                      minDate={startDate}
                      minDateMessage='Thời gian kết thúc không hợp lệ'
                      fullWidth
                      margin="normal"
                    />
                  </MuiPickersUtilsProvider>
                  <br />
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary">Tạo</Button>
                    <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Hủy</Button>
                  </div>
                </form>
              </div>
            </Fade>
          </Modal>
        </Paper>
      </div>}
    </>
  )
}