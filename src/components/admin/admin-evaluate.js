import React, { useState, useEffect } from 'react';
import axios from "axios";
import moment from 'moment'

import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { Link, useHistory, useRouteMatch} from 'react-router-dom';

import Skeleton from '../common/Skeleton';

import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from '@material-ui/icons/Delete';
import Toast from '../common/Snackbar'
import Loading from '../common/Loading'
import IconButton from "@material-ui/core/IconButton";
import DialogConfirm from '../common/DialogConfirm'
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";



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
  function ListItem(props) {
    return (
      // <li>{props.id}</li>
      <tr>
        <td style={{ lineHeight: '50px', paddingLeft: 10 }}><Link to={'/admin/evaluate-settings/' + props.id}>{props.value}</Link></td>
        <td style={{ textAlign: 'center', lineHeight: '50px' }}>{props.id}</td>
        <td style={{ textAlign: 'center', lineHeight: '50px', width: '30%' }}>{props.description}</td>
        <td align='center'>{props.start.toString()}</td>
        <td align='center'>{props.end.toString()}</td>
        <td align='center' style={{ width: '120px' }}>
          <IconButton
            aria-label="update"
            onClick={() => onEdit(props.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => onDelete(props.id)}
          >
            <DeleteIcon />
          </IconButton>
  
        </td>
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
            <th style={{ textAlign: 'center' }}></th>
          </tr>
        </thead>
        <tbody>
          {listItems}
        </tbody>
      </table>
    );
  }
  const classes = useStyles();
 //open modal
 const [modal, setModal] = React.useState({ open: false, id: '' });
 const handleOpen = () => {
   setModal({ open: true, id: '' });
   setStartDate(new Date())
   setEndDate(new Date())
 };
 const handleClose = () => {
   setModal({ ...modal, open: false });
 };

  //date picker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  //new Evaluation
  const [listStage, setListStage] = useState(null);

  //fe to be
  const token = localStorage.getItem('token')
  const fetchReview = () => {
    axios.get('/admin/review/', { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data.reviews);
        setListStage(res.data.reviews)
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
        setListStage(liststage => [...liststage, { code: id, name: evaluationName, start_date: moment(startDate).toString(), end_date: moment(endDate).toString(), description }])
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
  //modal delete
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => deleteUserWithAPI(id) })
  }

  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  // xoá user vs api
  const deleteUserWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/user/${id}/delete`, {}, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        const newLists = listStage.filter(row => row.code !== id)
        console.log(newLists)
        setListStage(newLists)
        setToast({ open: true, time: 3000, message: 'Xoá đợt đánh giá thành công', severity: 'success' })
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        setToast({ open: true, time: 3000, message: 'Xoá đợt đánh giá thất bại', severity: 'error' })
        setLoading(false)
      })
  }
  //edit Modal
  const onEdit = id => {
    listStage.forEach(u => {
      if (u.code === id) {
        setId(id)
        setName(u.name)
        setDescription(u.description)
        setStartDate(u.start_date)
        setEndDate(u.end_date)
      }
    })
    setModal({ open: true, id })
  }
  let history = useHistory();
  const { url } = useRouteMatch()
  const redirectStorePage = () => {
    history.push(`${url}/deleted`)
  }
  return (
    <>
      { !listStage ? <Skeleton /> : <div>
        <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
        <Toast toast={toast} handleClose={handleCloseToast} />
        <Loading open={loading} />
        <Typography component="h1" variant="h5" color="inherit" noWrap>
          DANH SÁCH ĐỢT ĐÁNH GIÁ
      </Typography>
        <Paper className={classes.paper}>
          <NumberList numbers={listStage} />
          <div style={{ margin: 10, justifyContent: 'space-between', display: 'flex' }}>
            <Button variant="contained" className={classes.btn} onClick={redirectStorePage}>
              Khôi phục
              </Button>
            <Button variant="contained" color='primary' type="button" onClick={handleOpen}>Thêm đợt đánh giá</Button>
          </div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={modal.open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={modal.open}>
              <div className={classes.paper1}>
                <Typography variant='h5' gutterBottom id="transition-modal-title">{modal.id ? "Cập nhật đợt đánh giá" : "Thêm đợt đánh giá"}</Typography>
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
                    defaultValue={modal.id && id}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="evaluateName"
                    label="Tên đợt đánh giá"
                    onChange={e => setName(e.target.value)}
                    defaultValue={modal.id && evaluationName}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="evaluateName"
                    label="Mô tả"
                    onChange={e => setDescription(e.target.value)}
                    defaultValue={modal.id && description}
                  />
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDateTimePicker
                      ampm={false}
                      label="Bắt đầu"
                      value={startDate}
                      onChange={setStartDate}
                      onError={console.log}
                      disableToolbar
                      format="HH:mm DD/MM/yyyy"
                      invalidDateMessage='Thời gian không hợp lệ'
                      fullWidth
                      margin="normal"
                      minDate
                    />
                    <KeyboardDateTimePicker
                      ampm={false}
                      label="Kết thúc"
                      value={endDate}
                      onChange={setEndDate}
                      onError={console.log}

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
                    <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary">{modal.id ? "Cập nhật" : 'Tạo'}</Button>
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