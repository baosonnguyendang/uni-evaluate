import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HelpIcon from '@material-ui/icons/Help';
// Icons
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import EditIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import Skeleton from '../../common/Skeleton'
import { Link, useRouteMatch } from 'react-router-dom'

import Loading from '../../common/Loading'
import DialogConfirm from '../../common/DialogConfirm'
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
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
    width: '30%',
    height: 30,
  },
  number: {
    width: '10%'
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
    marginBottom: 8,
    minWidth: 120,
  },
}));

const CustomTableCell = ({ row, name }) => {
  const classes = useStyles();
  return (
    <TableCell align="left" className={classes.tableCell}>
      {name === 'namedepartment' ? (<Link to={`/admin/faculty/${row['department_code']}`} style={{ color: 'black' }}>{row['name']}</Link>) : (row[name])}
    </TableCell>
  );
};

const UserOfFaculty = () => {
  let { id } = useParams();

  const [rows, setRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true)
  const classes = useStyles();
  // tên đơn vị
  const [nameDept, setLNameDept] = useState('')
  const [children, setChildren] = useState([])
  const fetchChildren = () => {
    return axios.get(`/admin/department/${id}/children`)
      .then(res => {
        console.log(res.data);
        setLNameDept(res.data.parent.name)

        const temp = res.data.children.map(c => c.manager ? ({...c, namemanager: `${c.manager.lastname} ${c.manager.firstname}`, idmanager: c.manager.staff_id}) : c)
        console.log(temp)
        setChildren(temp)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const fetchUserOfFaculty = () => {
    return axios.get(`/admin/department/${id}/user`)
      .then(res => {
        console.log(res.data);
        setRows(res.data.user.map(user => ({ ...user, department: user.department.map(dep => dep.name).join(", ") })))
        if (res.data.department.manager) {
          setIdExistHeadUnit(res.data.department?.manager?.staff_id)
          setIdHeadUnit(res.data.department?.manager?.staff_id)
          setNameHeadUnit(res.data.department?.manager?.lastname + ' ' + res.data.department?.manager?.firstname)
          console.log(nameHeadUnit)
        }

      })
      .catch(err => {
        console.log(err)
      })

  }
  // fetch deleted children
  const [deletedChildren, setDeletedChildren] = useState([])
  const fetchDeletedSubDept = (id) => {
    return axios.get(`/admin/department/deleted/${id}/children`)
      .then(res => {
        console.log(res.data)
        setDeletedChildren(res.data.departments)
      })
      .catch(e => {
        console.log(e.response)
      })
  }
  useEffect(() => {
    setIsLoading(true)
    Promise.all([fetchUserOfFaculty(), fetchChildren(), fetchDeletedSubDept(id)])
      .then(res => {
        setIsLoading(false)
      })
  }, [id])
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
  const handleOpen = () => {
    setModal({ open: true, id: '', addSubDept: false, setHeadUnit: false });
  };
  //open modal
  const [modal, setModal] = React.useState({ open: false, id: '' });
  const handleClose = () => {
    setModal({ ...modal, open: false });
    setOpenAddUser(false);
    setIdHeadUnit(null)
    setHeadUnit(null)
  };
  const [idDept, setIdDept] = useState(null)
  const [name, setName] = useState(null)
  const onEdit = id => {
    children.forEach(u => {
      if (u.department_code === id) {
        setIdDept(id)
        setName(u.name)
      }
    })
    setModal({ open: true, id })
  }
  const dispatch = useDispatch()
  // edit submit dept
  const submitEditDept = (e, id_dept) => {
    e.preventDefault()
    const body = { new_dcode: idDept, name }
    setLoading(true)
    console.log(modal.id)

    handleClose()
    axios.post(`/admin/department/${id_dept}/edit`, body)
      .then(res => {
        setChildren(children.map(r => r.department_code === id_dept ? { ...r, department_code: idDept, name } : r))
        dispatch(showSuccessSnackbar('Cập nhật đơn vị thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('Mã đơn vị đã tồn tại'))
            break;
          default:
            dispatch(showErrorSnackbar('Cập nhật đơn vị thất bại'))
            break;
        }
        setLoading(false)
      })
  }


  // open modal thêm user đã có sẵn
  const [openAddUser, setOpenAddUser] = useState(false)
  const handleOpenAddUser = () => {
    setOpenAddUser(true)
  }

  const submitExistUser = (e) => {
    e.preventDefault()
    setLoading(true)
    handleClose()
    axios.post(`/admin/department/${id}/user/add`, { user_id: iduser })
      .then(res => {
        fetchUserOfFaculty()
          .then(() => {
            dispatch(showSuccessSnackbar('Thêm người dùng thành công'))
            setLoading(false)
          })
      })
      .catch(err => {
        switch (err.response?.status) {
          case 404:
            dispatch(showErrorSnackbar('Mã người dùng không đúng'))
            break;
          case 409:
            dispatch(showErrorSnackbar('Người dùng đã tồn tại'))
            break;
          default:
        }
        setLoading(false)
      })
  }

  //get data from new criterion
  const [iduser, setIduser] = React.useState('')
  const [lname, setLName] = React.useState('')
  const [fname, setFName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const submitNewUser = e => {
    e.preventDefault()
    setLoading(true)
    handleClose()
    axios.post(`/admin/department/${id}/user/create`, { id: iduser, lname, fname, email })
      .then(res => {
        console.log(res.data)
        fetchUserOfFaculty().then(res => {
          dispatch(showSuccessSnackbar('Tạo người dùng thành công'))
          setLoading(false)
        })
      })
      .catch(err => {
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('Mã người dùng đã tồn tại'))
            break;
          default:
            dispatch(showErrorSnackbar('Tạo người dùng thất bại'))
            break;
        }
        setLoading(false)
      })
  }
  const [loading, setLoading] = useState(false)
  // modal xoá
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const onDelete = (id, type) => {
    if (type) {
      setStatusDelete({ open: true, onClick: () => deleteUserDeptWithAPI(id) })
    }
    else {
      setStatusDelete({ open: true, onClick: () => deleteSubDeptWithAPI(id) })
    }
  }
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  // xoá dept vs api
  const deleteSubDeptWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/department/${id}/delete`, {})
      .then(res => {
        const newchildrens = children.filter(row => row.department_code !== id)
        setChildren(newchildrens)
        setDeletedChildren(children.filter(row => row.department_code === id))
        dispatch(showSuccessSnackbar('Xoá đơn vị thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Xoá đơn vị thất bại'))
        setLoading(false)
      })
  }
  // xoá dept vs api
  const deleteUserDeptWithAPI = (ucode) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/department/${id}/user/${ucode}/delete`, {})
      .then(res => {
        setRows(rows.filter(r => r.staff_id !== ucode))
        dispatch(showSuccessSnackbar('Xoá người dùng trong đơn vị thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Xoá dùng trong đơn vị thất bại'))
        setLoading(false)
      })
  }
  let history = useHistory();
  const { url } = useRouteMatch()
  const redirectStorePage = () => {
    history.push(`${url}/deleted`)
  }
  const handleOpenAddDept = () => {
    setModal({ ...modal, open: true, addSubDept: true, setHeadUnit: false })
  }
  //trưởng dv 
  const [headUnit, setHeadUnit] = React.useState('')
  // Thêm subDept
  const submitAddDepartment = (e) => {
    e.preventDefault()
    setLoading(true)
    const body = {
      department_code: idDept,
      name,
      manager: headUnit,
      parent: id
    }
    console.log(body)
    handleClose();
    axios.post('/admin/department/addDepartment', body)
      .then(res => {
        //console.log(res.data);
        dispatch(showSuccessSnackbar('Tạo đơn vị thành công'))
        setChildren(rows => [...rows, { department_code: idDept, name, idmanager: headUnit, parent: id }])
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('Mã đơn vị đã tồn tại'))
            break;
          case 404:
            dispatch(showErrorSnackbar('Mã trưởng đơn vị không đúng'))
            break;
          default:
            dispatch(showErrorSnackbar('Tạo đơn vị thất bại'))
            break;
        }
        setLoading(false)
      })
  }
  // Sửa trưởng dv
  const [idExistHeadUnit, setIdExistHeadUnit] = useState(null)
  const [nameHeadUnit, setNameHeadUnit] = useState('')
  const [idHeadUnit, setIdHeadUnit] = useState(null)
  const handleOpenSetHeadUnit = () => {
    setModal({ ...modal, setHeadUnit: true, open: true })
  }
  //cập nhật trưởng dv
  const editHeadUnit = () => {
    const body = { manager: idHeadUnit }
    setLoading(true)
    console.log(modal.id)

    handleClose()
    axios.post(`/admin/department/${id}/editHead`, body)
      .then(res => {
        fetchUserOfFaculty()
          .then(() => {
            dispatch(showSuccessSnackbar('Cập nhật trưởng đơn vị thành công'))
            setLoading(false)
          })
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 404:
            dispatch(showErrorSnackbar('Mã trưởng đơn vị không đúng'))
            break;
          default:
            dispatch(showErrorSnackbar('Cập nhật đơn vị thất bại'))
            break;
        }
        setLoading(false)
      })
  }
  return (
    <>
      {isLoading ? <Skeleton /> : (
        <>
          <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
          <Typography component="h1" variant="h5" color="inherit" noWrap>
            DANH SÁCH NGƯỜI DÙNG ĐƠN VỊ {nameDept.toUpperCase()}
          </Typography>
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                  <TableCell align="left">ID</TableCell>
                  <TableCell align="left">Họ và tên đệm</TableCell>
                  <TableCell align="left">Tên</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Đơn vị</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow key={row._id}>
                      <CustomTableCell className={classes.name} {...{ row, name: "staff_id" }} />
                      <CustomTableCell className={classes.name} {...{ row, name: "lastname", }} />
                      <CustomTableCell className={classes.name} {...{ row, name: "firstname", }} />
                      <CustomTableCell className={classes.name} {...{ row, name: "email", }} />
                      <CustomTableCell className={classes.name} {...{ row, name: "department", }} />
                      <TableCell align="right" >
                        <Tooltip title='Xóa'>
                          <IconButton
                            aria-label="delete"
                            onClick={() => onDelete(row.staff_id, 'user')}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {rows.length === 0 && <TableRow><TableCell colSpan={6}>Không tồn tại người dùng</TableCell></TableRow>}
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
            <div style={{ margin: '10px', textAlign: 'right' }}>
              <div>
                <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpenSetHeadUnit}>
                  Trưởng đơn vị
                </Button>
                <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                  Tạo người dùng
                </Button>
                <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpenAddUser}>
                  Thêm người dùng có sẵn
                </Button>
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
                    {modal.setHeadUnit && <Typography gutterBottom variant='h5' id="transition-modal">Trưởng đơn vị</Typography>}
                    {!modal.setHeadUnit && <Typography gutterBottom variant='h5' id="transition-modal">{modal.addSubDept ? 'Thêm đơn vị trực thuộc mới' : modal.id ? 'Cập nhật đơn vị' : 'Tạo người dùng'}</Typography>}
                    <form onSubmit={modal.addSubDept ? submitAddDepartment : modal.id ? (e) => submitEditDept(e, modal.id) : submitNewUser}>
                      {!modal.setHeadUnit ?
                        <>
                          {!modal.addSubDept && (modal.id ?
                            <>
                              <TextField onChange={e => setIdDept(e.target.value)} required id="id" label="ID" variant="outlined" fullWidth margin='normal' defaultValue={idDept} />
                              <TextField onChange={e => setName(e.target.value)} required id="name" label="Tên đơn vị" variant="outlined" fullWidth margin='normal' defaultValue={name} />
                            </> :
                            <>
                              <TextField onChange={e => setIduser(e.target.value)} required id="id" label="ID" variant="outlined" fullWidth margin='normal' />
                              <TextField onChange={e => setLName(e.target.value)} required id="lname" label="Họ và tên đệm" variant="outlined" fullWidth margin='normal' />
                              <TextField onChange={e => setFName(e.target.value)} required id="fname" label="Tên" variant="outlined" fullWidth margin='normal' />
                              <TextField onChange={e => setEmail(e.target.value)} required type='email' id="email" label="Email" multiline variant="outlined" fullWidth margin='normal' />
                            </>)}
                          {modal.addSubDept &&
                            <>
                              <TextField onChange={e => setIdDept(e.target.value)} id="id" label="ID" variant="outlined" fullWidth required margin='normal' />
                              <TextField onChange={e => setName(e.target.value)} id="name" label="Tên" variant="outlined" fullWidth required margin='normal' />
                              <TextField onChange={e => setHeadUnit(e.target.value)} id="headId" label="ID Trưởng đơn vị" fullWidth variant="outlined" margin='normal' />
                            </>}

                          <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >{modal.id ? "Cập nhật" : 'Tạo'}</Button>
                            <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Thoát</Button>
                          </div>
                        </> :
                        <>
                          <TextField onChange={e => setIdHeadUnit(e.target.value)} required id="id" label="ID" variant="outlined" fullWidth margin='normal' defaultValue={idExistHeadUnit} />
                          <TextField onChange={e => setName(e.target.value)} required id="name" label="Tên trưởng đơn vị" variant="outlined" disabled fullWidth margin='normal' defaultValue={nameHeadUnit} />
                          <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <Button style={{ marginRight: '10px' }} variant="contained" disabled={idExistHeadUnit === idHeadUnit} color="primary" onClick={editHeadUnit}>Cập nhật</Button>
                            <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Thoát</Button>
                          </div>
                        </>}

                    </form>
                  </div>
                </Fade>
              </Modal>

              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openAddUser}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={openAddUser}>
                  <div className={classes.paper1}>
                    <Typography variant='h5' gutterBottom id="transition-modal-title">Thêm người dùng có sẵn</Typography>
                    <form onSubmit={submitExistUser}>
                      <TextField id="id" label="ID" required onChange={(e) => setIduser(e.target.value)} name='idexistuser' variant="outlined" fullWidth margin='normal' />
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >Tạo</Button>
                        <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Thoát</Button>
                      </div>
                    </form>
                  </div>
                </Fade>
              </Modal>
              <Loading open={loading} />

            </div>
          </Paper>
          {(children.length !== 0 || deletedChildren.length !== 0) && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography component="h1" variant="h5" color="inherit" noWrap onClick={() => id = 10}>
                  DANH SÁCH ĐƠN VỊ TRỰC THUỘC
                </Typography>
                <Tooltip title={
                  <Typography variant='subtitle2'>Chọn tên đơn vị để xem danh sách người dùng trực thuộc</Typography>
                }>
                  <HelpIcon fontSize='small' color='action' />
                </Tooltip>
              </div>
              <Paper className={classes.root}>
                <Table className={classes.table} aria-label="caption table">
                  <TableHead>
                    <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                      <TableCell align="left">ID</TableCell>
                      <TableCell align="left">Tên đơn vị</TableCell>
                      <TableCell className={classes.name} align="left">Trưởng đơn vị</TableCell>
                      <TableCell align="left">ID Trưởng đơn vị</TableCell>
                      <TableCell align="left" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {children.map((row) => {
                      return (
                        <TableRow key={row.department_code}>
                          <CustomTableCell {...{ row, name: "department_code", }} />
                          <CustomTableCell  {...{ row, name: "namedepartment", }} />
                          <CustomTableCell  {...{ row, name: "namemanager", }} />
                          <CustomTableCell  {...{ row, name: "idmanager", }} />
                          <TableCell className={classes.selectTableCell}>
                            <Tooltip title='Sửa'>
                              <IconButton
                                aria-label="update"
                                onClick={() => onEdit(row.department_code)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Xóa'>
                              <IconButton
                                aria-label="delete"
                                onClick={() => onDelete(row.department_code)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {children.length === 0 && <TableRow><TableCell colSpan={5}>Không có đơn vị trực thuộc</TableCell></TableRow>}
                  </TableBody>
                </Table>
                <div style={{ margin: 10, justifyContent: 'space-between', display: 'flex' }}>
                  <Button variant="contained" className={classes.btn} onClick={redirectStorePage}>
                    Khôi phục
                  </Button>
                  <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpenAddDept}>
                    Thêm đơn vị mới
                  </Button>
                </div>
              </Paper>

            </>)}
        </>
      )
      }
    </>
  )
}

export default UserOfFaculty
