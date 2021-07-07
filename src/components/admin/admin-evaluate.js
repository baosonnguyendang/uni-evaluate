import React, { useState, useEffect } from 'react';
import axios from "axios";
import moment from 'moment'

import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';

import Skeleton from '../common/Skeleton';

import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from '@material-ui/icons/Delete';
import Loading from '../common/Loading'
import IconButton from "@material-ui/core/IconButton";
import DialogConfirm from '../common/DialogConfirm'
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../actions/notifyAction'
import HelpIcon from '@material-ui/icons/Help';
import { TableCell, TableHead, TableRow, Table, TableBody } from '@material-ui/core'
import TablePagination from '@material-ui/core/TablePagination';

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
      <TableRow>
        <TableCell style={{ lineHeight: '50px', paddingLeft: 10 }}><Link to={'/admin/evaluate-settings/' + props.id} style={{ color: 'black' }}>{props.value}</Link></TableCell>
        <TableCell style={{ lineHeight: '50px' }}>{props.id}</TableCell>
        <TableCell style={{ lineHeight: '50px', width: '30%' }}>{props.description}</TableCell>
        <TableCell >{props.start.toString()}</TableCell>
        <TableCell >{props.end.toString()}</TableCell>
        <TableCell align='right' style={{paddingRight: 0}} >
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

        </TableCell>
      </TableRow>
    )
  }

  function NumberList(props) {
    //qua trang
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const numbers = props.numbers;
    const listItems = numbers.map((item) =>
      // Correct! Key should be specified inside the array.
      // <Link to={'/admin/evaluate-settings/' + item.id}>
      <ListItem key={item.code} id={item.code}
        value={item.name}
        start={moment(item.start_date).format("HH:mm DD/MM/yyyy")}
        end={moment(item.end_date).format("HH:mm DD/MM/yyyy")}
        description={item.description}
      />
      //</Link>
    );
    return (
      <div>
        <Table style={{ width: '100%', marginBottom: 10 }}>
          <TableHead style={{ backgroundColor: '#f4f4f4', lineHeight: '50px' }}>
            <TableRow>
              <TableCell style={{ width: '21%', paddingLeft: 10 }}>Tên đợt đánh giá</TableCell>
              <TableCell style={{ width: '12%'}} >Mã đợt</TableCell>
              <TableCell style={{ width: '30%' }}>Mô tả</TableCell>
              <TableCell style={{ width: '14%' }} >Ngày bắt đầu</TableCell>
              <TableCell style={{ width: '14%' }}>Ngày kết thúc</TableCell>
              <TableCell align="right" style={{ width: 120}}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {numbers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) =>
              <ListItem key={item.code} id={item.code}
                value={item.name}
                start={moment(item.start_date).format("HH:mm DD/MM/yyyy")}
                end={moment(item.end_date).format("HH:mm DD/MM/yyyy")}
                description={item.description}
              />
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={numbers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    );
  }
  const dispatch = useDispatch()
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
    e.preventDefault()
    //nếu thời gian bắt đầu lớn hơn thì k submit dc
    if(moment(endDate).isBefore(startDate)) return
    
    setLoading(true)
    handleClose()
    axios.post('/admin/review/add', { code: id, name: evaluationName, start_date: startDate.toString(), end_date: endDate.toString(), description }, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data)
        setListStage(liststage => [...liststage, { code: id, name: evaluationName, start_date: moment(startDate).toString(), end_date: moment(endDate).toString(), description }])
        dispatch(showSuccessSnackbar('Tạo đợt đánh giá thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('Mã đợt đánh giá đã tồn tại'))
            break;
          default:
            dispatch(showErrorSnackbar('Tạo đợt đánh giá thất bại'))
            break;
        }
        setLoading(false)
      })
  }
  // loading thêm đợt
  const [loading, setLoading] = useState(false)

  //modal delete
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => deleteEvaluateWithAPI(id) })
  }

  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  // xoá đợt dánh giá vs api
  const deleteEvaluateWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/review/${id}/delete`, {}, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        const newLists = listStage.filter(row => row.code !== id)
        console.log(newLists)
        setListStage(newLists)
        dispatch(showSuccessSnackbar('Xoá đợt đánh giá thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Xoá đợt đánh giá thất bại'))
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
  //api edit đợt đánh giá
  const submitEditEvaluate = (e) => {
    e.preventDefault()
    //nếu thời gian bắt đầu lớn hơn thì k submit dc
    if(moment(endDate).isBefore(startDate)) return
    
    const body = { new_rcode: id, name: evaluationName, start_date: startDate, end_date: endDate, description }
    setLoading(true)
    console.log(modal.id, body)
    handleClose()
    axios.post(`/admin/review/${modal.id}/edit`, body, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setListStage(listStage.map(r => r.code === modal.id ? { ...r, code: id, name: evaluationName, start_date: startDate, end_date: endDate, description } : r))
        dispatch(showSuccessSnackbar('Cập nhật thông tin đợt đánh giá thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('Mã đợt đánh giá đã tồn tại'))
            break;
          default:
            dispatch(showErrorSnackbar('Cập nhật thông tin đợt đánh giá thất bại'))
            break;
        }
        setLoading(false)
      })
  }
  let history = useHistory();
  const { url } = useRouteMatch()
  const redirectStorePage = () => {
    history.push(`${url}/deleted`)
  }
  return (
    <>
      {!listStage ? <Skeleton /> : <div>
        <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
        <Loading open={loading} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component="h1" variant="h5" color="inherit" noWrap>
            DANH SÁCH ĐỢT ĐÁNH GIÁ
          </Typography>
          <Tooltip title={
            <>
              <Typography variant='subtitle2'>Chọn tên đợt đánh giá để xem chi tiết</Typography>
            </>
          }>
            <HelpIcon fontSize='small' color='action' />
          </Tooltip>
        </div>
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
                <form onSubmit={modal.id ? submitEditEvaluate : submit}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
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
                    label="Tên đợt đánh giá"
                    onChange={e => setName(e.target.value)}
                    defaultValue={modal.id && evaluationName}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
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
                      maxDate={endDate}
                      maxDateMessage='Thời gian bắt đầu không hợp lệ'
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