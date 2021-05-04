import React, { useState, useEffect } from 'react';
import axios from "axios";

import EvaluateSetting from './evaluate-setting/admin-evaluate-setting'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import DatePicker from 'react-datepicker';

import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Toast from '../common/snackbar'

import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

function ListItem(props) {
  return (
    // <li>{props.id}</li>
    <tr>
      <td style={{ width: '30%', lineHeight: '50px', paddingLeft: 10 }}><Link to={'/admin/evaluate-settings/' + props.id}>{props.value}</Link></td>
      <td style={{ textAlign: 'center', lineHeight: '50px' }}>{props.id}</td>
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
    <ListItem key={item.id} id={item.code} value={item.name} start={new Date(item.start_date)} end={new Date(item.end_date)} />
    //</Link>
  );
  return (
    <table style={{ width: '100%', marginBottom: 10 }}>
      <thead style={{ backgroundColor: '#f4f4f4', lineHeight: '50px' }}>
        <tr>
          <th style={{ width: '30%', paddingLeft: 10 }}>Tên đợt đánh giá</th>
          <th style={{ textAlign: 'center', }}>Mã đợt</th>
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
    paddingBottom: '10px',
    marginTop: '15px'
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
  const listEvaluate = [
    { id: 1, name: 'Đợt 1 năm 2020', start: new Date('January 14 2021'), end: new Date('November 14 2021') },
    { id: 2, name: 'Đợt 2 năm 2020', start: new Date('January 1 2021'), end: new Date('December 14 2021') },
  ];
  const [number, setNumber] = useState([]);


  //fe to be
  const token = localStorage.getItem('token')
  const fetchReview = () => {
    axios.get('/admin/review/', { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        // console.log(res.data);
        setNumber(res.data.reviews)
        // setRows(res.data.users.map(user => ({ ...user, department: user.department.map(dep => dep.name).join(", "), isEditMode: false })))
        // setPrevious([...rows])
        // setIsLoading(false)
      })
  }
  useEffect(() => {
    fetchReview()
  }, [])

  const [evaluation, setEvaluation] = useState('')
  const [id, setId] = useState('')
  const [des, setD] = useState('')

  const [toast, setToast] = useState({ open: false, time: "2000", message: '', severity: '' })
  const handleOpenToast = (message, severity, time = '2000') => {
    setToast({ ...toast, message, time, severity, open: true });
  };
  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const submit = e => {
    console.log(startDate)
    e.preventDefault()
    setNumber(number => [...number, { code: id, name: evaluation, start_date: startDate, end_date: endDate }])
    axios.post('/admin/review/add', { code: id, name: evaluation, start_date: startDate, end_date: endDate }, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data)
        handleClose()
        handleOpenToast("Tạo đợt đánh giá thành công", 'success')
        // handleOpenToast("Tạo tiêu chuẩn thành công", 'success')
        // setRows(rows => [...rows, data])
      })
      .catch(e => {
        console.log(e)
        handleOpenToast("Lỗi gì rồi ông ơi", 'error')
      })

    // // useEffect
    // console.log(number)
    // console.log(listEvaluate)
  }

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        DANH SÁCH ĐỢT ĐÁNH GIÁ
      </Typography>
      <Paper className={classes.paper}>
        <NumberList numbers={number} />
        <Button style={{ marginLeft: 10 }} variant="contained" type="button" onClick={handleOpen}>Thêm đợt đánh giá</Button>
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
              <h2 id="transition-modal-title">Thêm đợt đánh giá</h2>
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
                  autoFocus
                  onChange={e => setEvaluation(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="evaluateName"
                  label="Mô tả"
                  autoFocus
                  onChange={e => setD(e.target.value)}
                />
                <label>Từ ngày:  &nbsp; </label>
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} selectsStart
                  startDate={startDate} endDate={endDate} dateFormat="dd/MM/yyyy"
                />
                <br />
                <label>Đến ngày:&nbsp; </label>
                <DatePicker selected={endDate} onChange={date => setEndDate(date)} selectsEnd
                  startDate={startDate} endDate={endDate} minDate={startDate} dateFormat="dd/MM/yyyy"
                />
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
    </div>
  )
}