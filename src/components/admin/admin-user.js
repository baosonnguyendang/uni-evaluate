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
        console.log(res.data.users.map(user => ({ ...user, department: user.department.map(dep => dep.name).join(", ") })))
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err.response)
        setIsLoading(false)
      })
  }
  // Danh sách đơn vị
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
  // modal xoá
  const [statusDelete, setStatusDelete] = useState({ open: false })
  // xoá user vs api
  const deleteUserWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/user/${id}/delete`, {})
      .then(res => {
        const newRows = rows.filter(row => row.staff_id !== id)
        console.log(newRows)
        setRows(newRows)
        setFilterUser(newRows)
        dispatch(showSuccessSnackbar('Xoá người dùng thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Xoá người dùng thất bại'))
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
  // modal.id là id user đang được edit
  const submitEditUser = (e) => {
    e.preventDefault()
    const body = { new_ucode: id, fname, lname, email, roles: role }
    setLoading(true)
    console.log(modal.id)

    handleClose()
    axios.post(`/admin/user/${modal.id}/edit`, body)
      .then(res => {
        setRows(rows.map(r => r.staff_id === modal.id ? { ...r, staff_id: id, firstname: fname, lastname: lname, roles: role, email } : r))
        setFilterUser(rows.map(r => r.staff_id === modal.id ? { ...r, staff_id: id, firstname: fname, lastname: lname, roles: role, email } : r))
        dispatch(showSuccessSnackbar('Cập nhật thông tin thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('Mã người dùng hoặc email đã tồn tại'))
            break;
          default:
            dispatch(showErrorSnackbar('Cập nhật thông tin thất bại'))
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
          dispatch(showSuccessSnackbar('Thêm người dùng thành công'))
          setLoading(false)
        })
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('Mã người dùng hoặc email đã tồn tại'))
            break;
          default:
            dispatch(showErrorSnackbar('Thêm người dùng thất bại'))
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
  // search người dùng
  const searchUser = (e) => {
    const value = e.target.value.toLowerCase()
    const temp = rows.filter(r => (r.firstname.toLowerCase().includes(value) ||
      r.lastname.toLowerCase().includes(value)
    ))
    console.log(temp)
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
    console.log(formData)
    setLoading(true)
    handleClose()
    axios.post("/admin/user/file/import", formData)
      .then(res => {
        console.log(res.data);
        dispatch(showSuccessSnackbar('Import excel người dùng thành công'))
        window.location.reload();
      })
      .catch(e => {
        console.log(e)
        dispatch(showErrorSnackbar('Import excel người dùng thất bại'))
      })
  }

  // submit file excel
  const exportExcel = (data) => {
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
      })
  }

  let history = useHistory();
  const { url } = useRouteMatch()
  const redirectStorePage = () => {
    history.push(`${url}/deleted`)
  }
  return (<>
    {isLoading ? <Skeleton /> : (
      <>
        <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
        <Loading open={loading} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography component="h1" variant="h5" color="inherit" noWrap>
            DANH SÁCH NGƯỜI DÙNG
          </Typography>
          <TextField id="standard-basic" type='search' label="Tìm kiếm" onChange={searchUser} />
        </div>

        <Paper className={classes.root}>
          <Table className={classes.table} aria-label="caption table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                <TableCell className={classes.number} align="left">ID</TableCell>
                <TableCell className={classes.name} align="left">Họ và tên đệm</TableCell>
                <TableCell className={classes.number} align="left">Tên</TableCell>
                <TableCell className={classes.email} align="left">Email</TableCell>
                <TableCell className={classes.unit} align="left">Đơn vị</TableCell>
                <TableCell align="left">Vai trò</TableCell>
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
                      <IconButton
                        aria-label="update"
                        onClick={() => onEdit(row.staff_id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => onDelete(row.staff_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
              {rows.length === 0 && <TableRow><TableCell colSpan={7}>Không tồn tại người dùng</TableCell></TableRow>}
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
                Khôi phục
              </Button>
            </div>
            <Tooltip title={<Typography variant='subtitle2'>Xuất excel mẫu</Typography>}>
              <IconButton
                onClick={exportExcel}
              >
                <AssignmentReturnedIcon fontSize='large' />
              </IconButton>
            </Tooltip>
            &nbsp;
            <Tooltip title={<Typography variant='subtitle2'>Nhập dữ liệu excel</Typography>}>
              <IconButton
                onClick={handleOpenImport}
              >
                <UnarchiveIcon fontSize='large' />
              </IconButton>
            </Tooltip>
            &nbsp;
            <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
              Thêm người dùng
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
                      <Typography variant='h5' gutterBottom id="transition-modal-title">{modal.id ? 'Cập nhật thông tin' : 'Thêm người dùng'}</Typography>
                      <form onSubmit={modal.id ? submitEditUser : submit}>
                        <TextField onChange={e => setId(e.target.value)} fullWidth defaultValue={modal.id && id} autoFocus required id="id" label="Mã người dùng" variant="outlined" fullWidth margin='normal' />
                        <TextField onChange={e => setLname(e.target.value)} defaultValue={modal.id && lname} required id="lname" label="Họ và tên đệm" variant="outlined" fullWidth margin='normal' />
                        <TextField onChange={e => setFname(e.target.value)} required defaultValue={modal.id && fname} id="fname" label="Tên" variant="outlined" fullWidth margin='normal' />
                        <TextField onChange={e => setEmail(e.target.value)} required defaultValue={modal.id && email} id="email" label="Email" multiline variant="outlined" fullWidth margin='normal' />

                        {modal.id ?
                          <FormControl variant="outlined" margin='normal' fullWidth className={classes.formControl}>
                            <InputLabel htmlFor="outlined-newUnit-native">Vai trò</InputLabel>
                            <Select
                              native
                              required
                              value={role}
                              label='Vai trò'
                              onChange={handleChangeRole}
                            >
                              <option aria-label="None" value="user">User</option>
                              <option aria-label="None" value="admin">Admin</option>
                            </Select>
                          </FormControl> :
                          <FormControl variant="outlined" margin='normal' fullWidth disabled={!!modal.id} className={classes.formControl}>
                            <InputLabel htmlFor="outlined-newUnit-native">Đơn vị</InputLabel>
                            <Select
                              native
                              value={newUnit}
                              label='Đơn vị'
                              onChange={handleChangeUnit}
                            >
                              <option aria-label="None" value="" />
                              {units.map(u => <option key={u._id} value={u.department_code}>{u.name}</option>)}
                            </Select>
                          </FormControl>
                        }

                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                          <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >{modal.id ? 'Cập nhật' : 'Tạo'}</Button>
                          <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Thoát</Button>
                        </div>
                      </form>
                    </> :
                    <UpLoadFile title={'Thêm danh sách người dùng'} handleClose={handleClose} submit={submitExcel} />}
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
