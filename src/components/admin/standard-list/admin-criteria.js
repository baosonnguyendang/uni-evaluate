import React, { useEffect, useState } from "react";
import { Link, useParams, useRouteMatch, useHistory } from 'react-router-dom';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
// Icons
import Backdrop from '@material-ui/core/Backdrop';
import { Button, Tooltip } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import EditIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import axios from 'axios'
import Loading from '../../common/Loading'
import Skeleton from '../../common/Skeleton'
import DialogConfirm from '../../common/DialogConfirm'
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'
import HelpIcon from '@material-ui/icons/Help';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },
  selectTableCell: {
    width: 120,
    paddingRight: 0,
  },
  tableCell: {
    height: 40,
  },
  input: {
    height: 40
  },
  name: {
    width: '35%',
    height: 40,
  },
  number: {
    width: '10%'
  },
  description: {
    width: '30%'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper1: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  field: {
    marginBottom: 10,
  },
  btn: {
    marginRight: 5,
    minWidth: 180,
  },
  btnback: {
    marginTop: theme.spacing(1),
    width: 80,
    color: '#212121',
    "&:hover": {
      color: '#212121'
    }
  }
}));

const CustomTableCell = ({ row, name }) => {
  const classes = useStyles();
  let { url } = useRouteMatch();

  return (
    <TableCell align="left" className={classes.tableCell}>
      {
        name === 'name' && row['type'] == 'radio' ? (<Link to={`${ url }/${ row['code'] }`} style={{ color: 'black' }}>{row[name]}</Link>) : (row[name])
      }
    </TableCell>
  );
};

export default function Criteria() {
  const dispatch = useDispatch()
  const [rows, setRows] = React.useState(null);
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const [nameStandard, setNameStandard] = useState('')
  const fetchCriteriaOfStandard = () => {
    axios.get(`admin/standard/${ id }/criteria`)
      .then(res => {
        setRows(res.data.criterions)
        setNameStandard(res.data.standard.name)
        setIsLoading(false)
      })
  }

  //criteriaTypes
  const [criteriaTypes, setCriteriaTypes] = useState([])
  const fetchCriteriaTypes = () => {
    axios.get(`admin/criteria/types`)
      .then(res => {
        setCriteriaTypes(res.data.types)
      })
  }

  useEffect(() => {
    // fetchCriteriaOfStandard()
    Promise.all([
      fetchCriteriaOfStandard(),
      fetchCriteriaTypes()
    ])
  }, [])

  // loading add criterion
  const [loading, setLoading] = useState(false)

  // modal xo??
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => deleteCriteriaWithAPI(id) })
  }

  // xo?? standard vs api
  const deleteCriteriaWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/criteria/${ id }/delete`, {})
      .then(res => {
        const newRows = rows.filter(row => row.code !== id)
        setRows(newRows)
        dispatch(showSuccessSnackbar('Xo?? ti??u ch?? th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Xo?? ti??u ch?? th???t b???i'))
        setLoading(false)
      })
  }


  //open modal
  const [modal, setModal] = React.useState({ open: false, id: '' });
  const handleOpen = () => {
    setModal({ open: true, id: '' });
  };
  const handleClose = () => {
    setModal({ ...modal, open: false });
    setType('')
  };
  const onEdit = id => {
    rows.forEach(u => {
      if (u.code === id) {
        setCode(id)
        setName(u.name)
        setDescription(u.description)
        setType(u.type)
      }
    })
    setModal({ open: true, id })
  }
  //edit with api
  const editCriteria = (e, id) => {
    e.preventDefault()
    const body = { new_ccode: code, name, description, type }
    setLoading(true)
    handleClose()
    axios.post(`/admin/criteria/${ id }/edit`, body)
      .then(res => {
        setRows(rows.map(r => r.code === id ? { ...r, code, name, description, type } : r))
        dispatch(showSuccessSnackbar('C???p nh???t ti??u ch?? th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('M?? ti??u ch?? ???? t???n t???i'))
            break;
          default:
            dispatch(showErrorSnackbar('C???p nh???t ti??u ch?? th???t b???i'))
            break;
        }
        setLoading(false)
      })
  }

  //sumbit form tao tieu chi
  const submitAddCriteria = (e) => {
    // console.log(code, name, description, type);
    e.preventDefault()
    setLoading(true)
    handleClose()
    const body = {
      name,
      code,
      description,
      type
    }
    axios.post(`/admin/standard/${ id }/criteria/add`, body)
      .then(res => {
        // ch??? n??y success th?? fe t???o b???ng
        // console.log(res.data);
        setRows(row => [...row, { name, code, description, type }])
        dispatch(showSuccessSnackbar('T???o ti??u ch?? th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('M?? ti??u ch?? ???? t???n t???i'))
            break;
          default:
            dispatch(showErrorSnackbar('T???o ti??u ch?? th???t b???i'))
            break;
        }
        setLoading(false)
      })
  }

  //get data from new criterion
  const [name, setName] = React.useState('')
  const [code, setCode] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [type, setType] = React.useState('');
  const handleChangeType = (event) => {
    // console.log(event.target.value)
    setType(event.target.value);
  };
  let history = useHistory();
  let { url } = useRouteMatch();
  const redirectStorePage = () => {
    history.push(`${ url }/deleted`)
  }
  return (
    <>
      {isLoading ? <Skeleton /> : (
        <div>
          <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
          <Loading open={loading} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography component="h1" variant="h5" color="inherit" noWrap >
              Ti??u chu???n {nameStandard} - Danh s??ch ti??u ch??
            </Typography >
            <Tooltip title={
              <>
                <Typography variant='subtitle2'>Ch???n t??n ti??u ch?? ????? xem danh s??ch l???a ch???n n???u c??</Typography>
              </>
            }>
              <HelpIcon fontSize='small' color="action" />
            </Tooltip>
          </div>
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                  <TableCell className={classes.number} >M?? ti??u ch??</TableCell>
                  <TableCell className={classes.name} >T??n ti??u ch??</TableCell>
                  <TableCell className={classes.description}>M?? t???</TableCell>
                  <TableCell >Ki???u ????nh gi??</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row._id}>
                    <CustomTableCell className={classes.number} {...{ row, name: "code" }} />
                    <CustomTableCell className={classes.name} {...{ row, name: "name" }} />
                    <CustomTableCell {...{ row, name: "description" }} />
                    <CustomTableCell {...{ row, name: "type" }} />
                    <TableCell className={classes.selectTableCell}>
                      <Tooltip title='S????a'>
                        <IconButton
                          aria-label="delete"
                          onClick={() => onEdit(row.code)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Xo??a'>
                        <IconButton
                          aria-label="delete"
                          onClick={() => onDelete(row.code)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && <TableRow><TableCell colSpan={5}>Kh??ng c?? ti??u ch??</TableCell></TableRow>}
              </TableBody>
            </Table>
            <div style={{ margin: 10, justifyContent: 'space-between', display: 'flex' }}>
              <Button variant="contained" className={classes.btn} onClick={redirectStorePage}>
                Kh??i ph???c
              </Button>
              <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                T???o ti??u ch?? m???i
              </Button>
              <Modal
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant='h5' gutterBottom id="transition-modal-title">{modal.id ? "C???p nh???t ti??u ch??" : 'Th??m ti??u ch??'}</Typography>
                      <Tooltip title={<>
                        <Typography variant='subtitle2' >Radio: ????nh gi?? nhi???u l???a ch???n </Typography>
                        <Typography variant='subtitle2' >Checkbox: ????nh gi?? m???t l???a ch???n </Typography>
                        <Typography variant='subtitle2' >Input: Nh???p v??o ????nh gi?? </Typography>
                        <Typography variant='subtitle2' >Number: ????nh gi?? theo s??? l???n </Typography>
                        <Typography variant='body2'>Detail: K?? khai v?? ????nh gi?? theo s??? % ????ng g??p </Typography>
                      </>} placement="right-start">
                        <HelpIcon fontSize='small' color='action' />
                      </Tooltip>
                    </div>
                    <form onSubmit={modal.id ? ((e) => editCriteria(e, modal.id)) : submitAddCriteria}>
                      <TextField onChange={e => setCode(e.target.value)} id="code" required label="M?? ti??u ch??" variant="outlined" fullWidth autoFocus margin='normal' defaultValue={modal.id && code} />
                      <TextField onChange={e => setName(e.target.value)} id="name" required label="T??n ti??u ch??" variant="outlined" fullWidth margin='normal' defaultValue={modal.id && name} />
                      <TextField onChange={e => setDescription(e.target.value)} id="description" label="M?? t???" multiline fullWidth variant="outlined" margin='normal' defaultValue={modal.id && description} />
                      <FormControl fullWidth variant="outlined" margin='normal' >
                        <InputLabel >Ki???u ????nh gi??</InputLabel>
                        <Select
                          native
                          required
                          value={type}
                          label='Ki???u ????nh gi??'
                          onChange={handleChangeType}
                        >
                          <option aria-label="None" value="" />
                          { //map criteria types
                            criteriaTypes.map(opt => (
                              <option value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                            ))
                          }
                        </Select>
                      </FormControl>
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary">{modal.id ? "C???p nh???t" : 'T???o'}</Button>
                        <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Tho??t</Button>
                      </div>
                    </form>
                  </div>
                </Fade>
              </Modal>
            </div>
          </Paper>
          <Link to='/admin/criterion' component={Button} className={classes.btnback} variant="contained" style={{ float: 'right' }} ><KeyboardReturnIcon /></Link>
        </div>
      )}
    </>

  );
}
