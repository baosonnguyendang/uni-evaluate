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
      <TableRow>
        <TableCell style={{ lineHeight: '50px', paddingLeft: 10 }}><Link to={'/admin/evaluate-settings/' + props.id} style={{ color: 'black' }}>{props.value}</Link></TableCell>
        <TableCell style={{ lineHeight: '50px' }}>{props.id}</TableCell>
        <TableCell style={{ lineHeight: '50px' }}>{props.description}</TableCell>
        <TableCell >{props.start.toString()}</TableCell>
        <TableCell >{props.end.toString()}</TableCell>
        <TableCell align='right' style={{ paddingRight: 0 }} >
          <Tooltip title='S????a'>
            <IconButton
              aria-label="update"
              onClick={() => onEdit(props.id)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Xo??a'>
            <IconButton
              aria-label="delete"
              onClick={() => onDelete(props.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
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
              <TableCell style={{ width: '21%', paddingLeft: 10 }}>T??n ?????t ????nh gi??</TableCell>
              <TableCell style={{ width: '12%' }} >M?? ?????t</TableCell>
              <TableCell style={{ width: '28%' }}>M?? t???</TableCell>
              <TableCell style={{ width: '14%' }} >Ng??y b???t ?????u</TableCell>
              <TableCell style={{ width: '14%' }}>Ng??y k???t th??c</TableCell>
              <TableCell align="right"></TableCell>
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
    axios.get('/admin/review/', { headers: { "Authorization": `Bearer ${ token }` } })
      .then(res => {
        // console.log(res.data.reviews);
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
    //n???u th???i gian b???t ?????u l???n h??n th?? k submit dc
    if (moment(endDate).isBefore(startDate)) return

    setLoading(true)
    handleClose()
    axios.post('/admin/review/add', { code: id, name: evaluationName, start_date: startDate.toString(), end_date: endDate.toString(), description }, { headers: { "Authorization": `Bearer ${ token }` } })
      .then(res => {
        // console.log(res.data)
        setListStage(liststage => [...liststage, { code: id, name: evaluationName, start_date: moment(startDate).toString(), end_date: moment(endDate).toString(), description }])
        dispatch(showSuccessSnackbar('T???o ?????t ????nh gi?? th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('M?? ?????t ????nh gi?? ???? t???n t???i'))
            break;
          default:
            dispatch(showErrorSnackbar('T???o ?????t ????nh gi?? th???t b???i'))
            break;
        }
        setLoading(false)
      })
  }
  // loading th??m ?????t
  const [loading, setLoading] = useState(false)

  //modal delete
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => deleteEvaluateWithAPI(id) })
  }

  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  // xo?? ?????t d??nh gi?? vs api
  const deleteEvaluateWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/review/${ id }/delete`, {}, { headers: { "Authorization": `Bearer ${ token }` } })
      .then(res => {
        const newLists = listStage.filter(row => row.code !== id)
        // console.log(newLists)
        setListStage(newLists)
        dispatch(showSuccessSnackbar('Xo?? ?????t ????nh gi?? th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Xo?? ?????t ????nh gi?? th???t b???i'))
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
  //api edit ?????t ????nh gi??
  const submitEditEvaluate = (e) => {
    e.preventDefault()
    //n???u th???i gian b???t ?????u l???n h??n th?? k submit dc
    if (moment(endDate).isBefore(startDate)) return

    const body = { new_rcode: id, name: evaluationName, start_date: startDate, end_date: endDate, description }
    setLoading(true)
    // console.log(modal.id, body)
    handleClose()
    axios.post(`/admin/review/${ modal.id }/edit`, body, { headers: { "Authorization": `Bearer ${ token }` } })
      .then(res => {
        setListStage(listStage.map(r => r.code === modal.id ? { ...r, code: id, name: evaluationName, start_date: startDate, end_date: endDate, description } : r))
        dispatch(showSuccessSnackbar('C???p nh???t th??ng tin ?????t ????nh gi?? th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('M?? ?????t ????nh gi?? ???? t???n t???i'))
            break;
          default:
            dispatch(showErrorSnackbar('C???p nh???t th??ng tin ?????t ????nh gi?? th???t b???i'))
            break;
        }
        setLoading(false)
      })
  }
  let history = useHistory();
  const { url } = useRouteMatch()
  const redirectStorePage = () => {
    history.push(`${ url }/deleted`)
  }
  return (
    <>
      {!listStage ? <Skeleton /> : <div>
        <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
        <Loading open={loading} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component="h1" variant="h5" color="inherit" noWrap>
            DANH S??CH ?????T ????NH GI??
          </Typography>
          <Tooltip title={
            <>
              <Typography variant='subtitle2'>Ch???n t??n ?????t ????nh gi?? ????? xem chi ti???t</Typography>
            </>
          }>
            <HelpIcon fontSize='small' color='action' />
          </Tooltip>
        </div>
        <Paper className={classes.paper}>
          <NumberList numbers={listStage} />
          <div style={{ margin: 10, justifyContent: 'space-between', display: 'flex' }}>
            <Button variant="contained" className={classes.btn} onClick={redirectStorePage}>
              Kh??i ph???c
            </Button>
            <Button variant="contained" color='primary' type="button" onClick={handleOpen}>Th??m ?????t ????nh gi??</Button>
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
                <Typography variant='h5' gutterBottom id="transition-modal-title">{modal.id ? "C???p nh???t ?????t ????nh gi??" : "Th??m ?????t ????nh gi??"}</Typography>
                <form onSubmit={modal.id ? submitEditEvaluate : submit}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="M?? ?????t ????nh gi??"
                    autoFocus
                    onChange={e => setId(e.target.value)}
                    defaultValue={modal.id && id}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="T??n ?????t ????nh gi??"
                    onChange={e => setName(e.target.value)}
                    defaultValue={modal.id && evaluationName}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="M?? t???"
                    onChange={e => setDescription(e.target.value)}
                    defaultValue={modal.id && description}
                  />
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDateTimePicker
                      ampm={false}
                      label="B???t ?????u"
                      value={startDate}
                      onChange={setStartDate}
                      onError={console.log}
                      disableToolbar
                      format="HH:mm DD/MM/yyyy"
                      invalidDateMessage='Th???i gian kh??ng h???p l???'
                      fullWidth
                      margin="normal"
                      maxDate={endDate}
                      maxDateMessage='Th???i gian b???t ?????u kh??ng h???p l???'
                    />
                    <KeyboardDateTimePicker
                      ampm={false}
                      label="K???t th??c"
                      value={endDate}
                      onChange={setEndDate}
                      onError={console.log}

                      disableToolbar
                      format="HH:mm DD/MM/yyyy"
                      invalidDateMessage='Th???i gian kh??ng h???p l???'
                      minDate={startDate}
                      minDateMessage='Th???i gian k???t th??c kh??ng h???p l???'
                      fullWidth
                      margin="normal"
                    />
                  </MuiPickersUtilsProvider>
                  <br />
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary">{modal.id ? "C???p nh???t" : 'T???o'}</Button>
                    <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>H???y</Button>
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