import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from "@material-ui/core/TableRow";
import { useHistory, useRouteMatch } from 'react-router-dom'
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
// Icons
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import EditIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import axios from "axios";
import Skeleton from '../common/Skeleton'
import Loading from '../common/Loading'
import DialogConfirm from '../common/DialogConfirm'
import UpLoadFile from '../common/UpLoadFile'
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../actions/notifyAction'
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import AssignmentReturnedIcon from '@material-ui/icons/AssignmentReturned';
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
    height: 30,
  },
  input: {
    height: 30
  },
  name: {
    width: '15%',
    height: 30,
  },
  number: {
    width: '10%'
  },
  unit: {
    width: '28%'
  },
  email: {
    width: '20%'
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
  field: {
    marginBottom: 10,
  },
  formControl: {
    marginBottom: 10,
    minWidth: 120,
  },
}));

const CustomTableCell = ({ row, name }) => {
  const classes = useStyles();
  return (
    <TableCell align="left" className={classes.tableCell}>
      {row[name]}
    </TableCell>
  );
};

export default function ListUser() {
  const dispatch = useDispatch()
  const [rows, setRows] = React.useState([]);
  const fetchUser = () => {
    return axios.get('/admin/user')
      .then(res => {
        setRows(res.data.users.map(user => ({ ...user, department: user.department.map(dep => dep.name).join(", ") })))
        setFilterUser(res.data.users.map(user => ({ ...user, department: user.department.map(dep => dep.name).join(", ") })))
        // console.log(res.data.users.map(user => ({ ...user, department: user.department.map(dep => dep.name).join(", ") })))
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err.response)
        setIsLoading(false)
      })
  }
  // Danh s??ch ????n v???
  const [units, setUnits] = useState([])

  useEffect(() => {
    const fetchAllDept = () => {
      axios.get('/admin/department')
        .then(res => {
          setUnits(res.data.departments)
        })
    }
    fetchUser()
    fetchAllDept()
  }, [])


  const classes = useStyles();
  // modal xo??
  const [statusDelete, setStatusDelete] = useState({ open: false })
  // xo?? user vs api
  const deleteUserWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/user/${ id }/delete`, {})
      .then(res => {
        const newRows = rows.filter(row => row.staff_id !== id)
        // console.log(newRows)
        setRows(newRows)
        setFilterUser(newRows)
        dispatch(showSuccessSnackbar('Xo?? ng?????i d??ng th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Xo?? ng?????i d??ng th???t b???i'))
        setLoading(false)
      })
  }
  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => deleteUserWithAPI(id) })
  }

  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  const onEdit = id => {
    filterUser.forEach(u => {
      if (u.staff_id === id) {
        setId(id)
        setFname(u.firstname)
        setLname(u.lastname)
        setEmail(u.email)
        setRole(u.roles)
      }
    })
    setModal({ open: true, id })
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

  //open modal
  const [modal, setModal] = React.useState({ open: false, id: '' });
  const handleOpen = () => {
    setOpenImport(false)
    setModal({ open: true, id: '' });
  };
  const handleClose = () => {
    setModal({ ...modal, open: false });
    setNewUnit('')
  };

  //get data from new criterion
  const [id, setId] = React.useState('')
  const [lname, setLname] = React.useState('')
  const [fname, setFname] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState('')
  const handleChangeRole = (e) => {
    setRole(e.target.value)
  }
  // edit user
  // modal.id l?? id user ??ang ???????c edit
  const submitEditUser = (e) => {
    e.preventDefault()
    const body = { new_ucode: id, fname, lname, email, roles: role }
    setLoading(true)
    // console.log(modal.id)

    handleClose()
    axios.post(`/admin/user/${ modal.id }/edit`, body)
      .then(res => {
        setRows(rows.map(r => r.staff_id === modal.id ? { ...r, staff_id: id, firstname: fname, lastname: lname, roles: role, email } : r))
        setFilterUser(rows.map(r => r.staff_id === modal.id ? { ...r, staff_id: id, firstname: fname, lastname: lname, roles: role, email } : r))
        dispatch(showSuccessSnackbar('C???p nh???t th??ng tin th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('M?? ng?????i d??ng ho???c email ???? t???n t???i'))
            break;
          default:
            dispatch(showErrorSnackbar('C???p nh???t th??ng tin th???t b???i'))
            break;
        }
        setLoading(false)
      })
  }
  //create new user
  const submit = e => {
    e.preventDefault()
    setLoading(true)
    const body = { id, lname, fname, email, dcode: newUnit }
    handleClose()
    axios.post('/admin/user/add', body)
      .then(res => {
        fetchUser().then((res) => {
          dispatch(showSuccessSnackbar('Th??m ng?????i d??ng th??nh c??ng'))
          setLoading(false)
        })
      })
      .catch(err => {
        console.log(err)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('M?? ng?????i d??ng ho???c email ???? t???n t???i'))
            break;
          default:
            dispatch(showErrorSnackbar('Th??m ng?????i d??ng th???t b???i'))
            break;
        }
        setLoading(false)
      })
  }

  // chon don vi trong modal
  const [newUnit, setNewUnit] = React.useState('');
  const handleChangeUnit = (event) => {
    setNewUnit(event.target.value);
  };
  const [isLoading, setIsLoading] = React.useState(true)
  const [loading, setLoading] = useState(false)
  // filter user
  const [filterUser, setFilterUser] = useState([])
  // search ng?????i d??ng
  const searchUser = (e) => {
    const value = e.target.value.toLowerCase()
    const temp = rows.filter(r => (r.firstname.toLowerCase().includes(value) ||
      r.lastname.toLowerCase().includes(value) || r.staff_id.toLowerCase().includes(value) || r.email.toLowerCase().includes(value)
    ))
    // console.log(temp)
    setFilterUser(temp)
    setPage(0);
  }
  // open import
  const [openImport, setOpenImport] = useState(false)
  const handleOpenImport = () => {
    handleOpen()
    setOpenImport(true)
  }
  // submit file excel
  const submitExcel = (data) => {
    const formData = new FormData()
    formData.append("file", data)
    // console.log(formData)
    setLoading(true)
    handleClose()
    axios.post("/admin/user/file/import", formData)
      .then(res => {
        // console.log(res.data);
        dispatch(showSuccessSnackbar('Import excel ng?????i d??ng th??nh c??ng'))
        window.location.reload();
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        dispatch(showErrorSnackbar('Import excel ng?????i d??ng th???t b???i'))
        setLoading(false)
      })
  }

  // submit file excel
  const exportExcel = (data) => {
    setLoading(true)
    axios({
      url: `/admin/file/download?file=user`,
      method: 'GET',
      responseType: 'blob', // important
    })
      .then(async res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `User.xlsx`); //or any other extension
        document.body.appendChild(link);
        link.click();
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  let history = useHistory();
  const { url } = useRouteMatch()
  const redirectStorePage = () => {
    history.push(`${ url }/deleted`)
  }
  return (<>
    {isLoading ? <Skeleton /> : (
      <>
        <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
        <Loading open={loading} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography component="h1" variant="h5" color="inherit" noWrap>
            DANH S??CH NG?????I D??NG
          </Typography>
          <TextField id="standard-basic" type='search' label="T??m ki???m" onChange={searchUser} />
        </div>

        <Paper className={classes.root}>
          <Table className={classes.table} aria-label="caption table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                <TableCell className={classes.number} align="left">ID</TableCell>
                <TableCell className={classes.name} align="left">H??? v?? t??n ?????m</TableCell>
                <TableCell className={classes.number} align="left">T??n</TableCell>
                <TableCell className={classes.email} align="left">Email</TableCell>
                <TableCell className={classes.unit} align="left">????n v???</TableCell>
                <TableCell align="left">Vai tr??</TableCell>
                <TableCell align="left" />
              </TableRow>
            </TableHead>
            <TableBody>
              {filterUser.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow key={row._id}>
                    <CustomTableCell {...{ row, name: "staff_id", }} />
                    <CustomTableCell {...{ row, name: "lastname", }} />
                    <CustomTableCell {...{ row, name: "firstname", }} />
                    <CustomTableCell {...{ row, name: "email", }} />
                    <CustomTableCell {...{ row, name: "department", }} />
                    <CustomTableCell {...{ row, name: "roles", }} />
                    <TableCell className={classes.selectTableCell}>
                      <Tooltip title='S????a'>
                        <IconButton
                          aria-label="update"
                          onClick={() => onEdit(row.staff_id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Xo??a'>
                        <IconButton
                          aria-label="delete"
                          onClick={() => onDelete(row.staff_id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
              {rows.length === 0 && <TableRow><TableCell colSpan={7}>Kh??ng t???n t???i ng?????i d??ng</TableCell></TableRow>}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={filterUser.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          <div style={{ margin: '10px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flexGrow: 1 }}>
              <Button variant="contained" className={classes.btn} onClick={redirectStorePage}>
                Kh??i ph???c
              </Button>
            </div>
            <Tooltip title={<Typography variant='subtitle2'>Xu???t excel m???u</Typography>}>
              <IconButton
                onClick={exportExcel}
              >
                <AssignmentReturnedIcon fontSize='large' />
              </IconButton>
            </Tooltip>
            &nbsp;
            <Tooltip title={<Typography variant='subtitle2'>Nh???p d??? li???u excel</Typography>}>
              <IconButton
                onClick={handleOpenImport}
              >
                <UnarchiveIcon fontSize='large' />
              </IconButton>
            </Tooltip>
            &nbsp;
            <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
              Th??m ng?????i d??ng
            </Button>

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
                  {!openImport ?
                    <>
                      <Typography variant='h5' gutterBottom id="transition-modal-title">{modal.id ? 'C???p nh???t th??ng tin' : 'Th??m ng?????i d??ng'}</Typography>
                      <form onSubmit={modal.id ? submitEditUser : submit}>
                        <TextField onChange={e => setId(e.target.value)} fullWidth defaultValue={modal.id && id} autoFocus required id="id" label="M?? ng?????i d??ng" variant="outlined" margin='normal' />
                        <TextField onChange={e => setLname(e.target.value)} defaultValue={modal.id && lname} required id="lname" label="H??? v?? t??n ?????m" variant="outlined" fullWidth margin='normal' />
                        <TextField onChange={e => setFname(e.target.value)} required defaultValue={modal.id && fname} id="fname" label="T??n" variant="outlined" fullWidth margin='normal' />
                        <TextField onChange={e => setEmail(e.target.value)} required defaultValue={modal.id && email} id="email" label="Email" variant="outlined" fullWidth margin='normal' type='email' />

                        {modal.id ?
                          <FormControl variant="outlined" margin='normal' fullWidth className={classes.formControl}>
                            <InputLabel htmlFor="outlined-newUnit-native">Vai tr??</InputLabel>
                            <Select
                              native
                              required
                              value={role}
                              label='Vai tr??'
                              onChange={handleChangeRole}
                            >
                              <option aria-label="None" value="user">User</option>
                              <option aria-label="None" value="admin">Admin</option>
                            </Select>
                          </FormControl> :
                          <FormControl variant="outlined" margin='normal' fullWidth disabled={!!modal.id} className={classes.formControl}>
                            <InputLabel htmlFor="outlined-newUnit-native">????n v???</InputLabel>
                            <Select
                              native
                              value={newUnit}
                              label='????n v???'
                              onChange={handleChangeUnit}
                            >
                              <option aria-label="None" value="" />
                              {units.map(u => <option key={u._id} value={u.department_code}>{u.name}</option>)}
                            </Select>
                          </FormControl>
                        }

                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                          <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >{modal.id ? 'C???p nh???t' : 'T???o'}</Button>
                          <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Tho??t</Button>
                        </div>
                      </form>
                    </> :
                    <UpLoadFile title={'Th??m danh sa??ch ng??????i du??ng'} handleClose={handleClose} submit={submitExcel} />}
                </div>


              </Fade>
            </Modal>
          </div>
        </Paper>
      </>
    )}
  </>
  )
}
