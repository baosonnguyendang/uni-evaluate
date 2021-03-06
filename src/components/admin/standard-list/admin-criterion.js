import React, { useState, useEffect } from "react";

import { Link, useRouteMatch, useHistory } from 'react-router-dom';

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
// Icons
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import EditIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import HelpIcon from '@material-ui/icons/Help';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import Loading from '../../common/Loading'
import Skeleton from '../../common/Skeleton'
import DialogConfirm from '../../common/DialogConfirm'
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'

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
    width: '30%',
    height: 40,
  },
  number: {
    width: '15%',
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
  btn: {
    marginRight: 5,
    minWidth: 180,
  },
}));

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  return (
    <TableCell className={classes.tableCell}>
      {
        name === 'name' ? (<Link to={{ pathname: '/admin/criterion/' + row._id }} style={{ color: 'black' }}>{row[name]}</Link>) : (row[name])
      }
    </TableCell>
  );
};

export default function Criterion() {
  const dispatch = useDispatch()
  const { url } = useRouteMatch()
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const fetchStandard = () => {
    return axios.get('admin/standard')
      .then(res => {
        // console.log(res.data.standards)
        setRows(res.data.standards)
        setIsLoading(false)
      })
      .catch(e => {
        console.log(e.response)
      })
  }
  useEffect(() => {
    fetchStandard()
  }, [])

  const classes = useStyles();

  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => deleteStandardWithAPI(id) })
  }

  // xo?? standard vs api
  const deleteStandardWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/standard/${ id }/delete`, {})
      .then(res => {
        const newRows = rows.filter(row => row.code !== id)
        setRows(newRows)
        dispatch(showSuccessSnackbar('Xo?? ti??u chu???n th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Xo?? ti??u chu???n th???t b???i'))
        setLoading(false)
      })
  }
  // modal xo??
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }

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

  //get data from new criterion
  const [name, setName] = React.useState('')
  const [code, setCode] = React.useState('')
  const [description, setDescription] = React.useState('')
  let data = { code, name, description }

  const submit = e => {
    e.preventDefault()
    handleClose()
    setLoading(true)
    axios.post('/admin/standard/add', data)
      .then(res => {
        fetchStandard()
          .then(() => {
            dispatch(showSuccessSnackbar('T???o ti??u chu???n th??nh c??ng'))
            setLoading(false)
          })
      })
      .catch(err => {
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('M?? ti??u chu???n ???? t???n t???i'))
            break;
          default:
            dispatch(showErrorSnackbar('T???o ti??u chu???n th???t b???i'))
            break;
        }
        setLoading(false)
      })
  }
  // loading add criterion
  const [loading, setLoading] = useState(false)

  //open modal
  const [modal, setModal] = React.useState({ open: false, id: '' });
  const handleOpen = () => {
    setModal({ open: true, id: '' });
  };
  const handleClose = () => {
    setModal({ ...modal, open: false });
  };
  const onEdit = id => {
    rows.forEach(u => {
      if (u.code === id) {
        setCode(id)
        setName(u.name)
        setDescription(u.description)
      }
    })
    setModal({ open: true, id })
  }
  const editCriterion = (e, id) => {
    e.preventDefault()
    // console.log(modal.id)
    // console.log(id)

    const body = { new_ccode: code, name, description }
    setLoading(true)

    handleClose()
    axios.post(`/admin/standard/${ id }/edit`, body)
      .then(res => {
        setRows(rows.map(r => r.code === id ? { ...r, code, name, description } : r))
        dispatch(showSuccessSnackbar('C???p nh???t ti??u chu???n th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('M?? ti??u chu???n ???? t???n t???i'))
            break;
          default:
            dispatch(showErrorSnackbar('C???p nh???t ti??u chu???n th???t b???i'))
            break;
        }
        setLoading(false)
      })
  }
  let history = useHistory();
  const redirectStorePage = () => {
    history.push(`${ url }/deleted`)
  }
  return (
    <>
      {isLoading ? <Skeleton /> :
        <div>
          <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
          <Loading open={loading} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography component="h1" variant="h5" color="inherit" noWrap>
              DANH S??CH TI??U CHU???N
            </Typography>
            <Tooltip title={
              <>
                <Typography variant='subtitle2'>Ch???n t??n ti??u chu???n ????? xem danh s??ch ti??u ch??</Typography>
              </>
            }>
              <HelpIcon fontSize='small' color='action' />
            </Tooltip>
          </div>
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                  <TableCell className={classes.number} align="left">M?? ti??u chu???n</TableCell>
                  <TableCell className={classes.name} align="left">T??n ti??u chu???n</TableCell>
                  <TableCell align="left">M?? t???</TableCell>
                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow key={row._id}>
                      <CustomTableCell {...{ row, name: "code" }} />
                      <CustomTableCell {...{ row, name: "name" }} />
                      <CustomTableCell {...{ row, name: "description" }} />
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
                  )
                })}
                {rows.length === 0 && <TableRow><TableCell colSpan={5}>Kh??ng c?? ti??u chu???n</TableCell></TableRow>}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            <div style={{ margin: 10, justifyContent: 'space-between', display: 'flex' }}>
              <Button variant="contained" className={classes.btn} onClick={redirectStorePage}>
                Kh??i ph???c
              </Button>
              <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                T???o ti??u chu???n m???i
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
                    <Typography variant="h5" gutterBottom color="inherit" noWrap>{modal.id ? "C???p nh???t ti??u chu???n" : 'Th??m ti??u chu???n'}</Typography>
                    <form onSubmit={modal.id ? (e) => editCriterion(e, modal.id) : submit}>
                      <TextField autoFocus required onChange={e => setCode(e.target.value)} id="code" label="M?? ti??u chu???n" variant="outlined" fullWidth margin='normal' defaultValue={modal.id && code} />
                      <TextField required onChange={e => setName(e.target.value)} id="name" label="T??n ti??u chu???n" variant="outlined" fullWidth margin='normal' defaultValue={modal.id && name} />
                      <TextField onChange={e => setDescription(e.target.value)} id="description" label="M?? t???" multiline variant="outlined" fullWidth margin='normal' defaultValue={modal.id && description} />
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary">{modal.id ? "C???p nh???t" : 'T???o'}</Button>
                        <Button style={{ marginRight: '10px' }} onClick={handleClose} variant="contained" color="primary">Hu???</Button>
                      </div>
                    </form>
                  </div>
                </Fade>
              </Modal>
            </div>
          </Paper>
        </div>}
    </>
  );
}
