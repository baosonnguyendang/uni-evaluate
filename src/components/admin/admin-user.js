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
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
// Icons
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import Skeleton from '../common/skeleton'
import Toast from '../common/snackbar'
import Loading from '../common/Loading'
import DialogConfirm from '../common/DialogConfirm'

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

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={e => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        (row[name])
      )}
    </TableCell>
  );
};

export default function ListUser() {
  const [rows, setRows] = React.useState([]);
  const token = localStorage.getItem('token')
  const fetchUser = () => {
    return axios.get('/admin/user', { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
              console.log(res.data.users);
              setRows(res.data.users.map(user => ({ ...user, department: user.department.map(dep => dep.name).join(", ")})))
              setFilterUser(res.data.users.map(user => ({ ...user, department: user.department.map(dep => dep.name).join(", ")})))
              console.log(rows)
              setIsLoading(false)
            })
  }
  // Danh sách đơn vị
  const [units, setUnits] = useState([])
  const fetchAllDept = () => {
    axios.get('/admin/department', { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setUnits(res.data.departments)
      })
  }
  useEffect(() => {
    fetchUser()
    fetchAllDept()
  }, [])


  const classes = useStyles();

  const onChange = (e, row) => {
    const value = e.target.value;
    const name = e.target.name;
    const { _id } = row;
    const newRows = rows.map(row => {
      if (row._id === _id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };
  // modal xoá
  const [statusDelete, setStatusDelete] = useState({ open: false })
  // xoá user vs api
  const deleteUserWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/user/${id}/delete`,{},{ headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        const newRows = rows.filter(row => row.staff_id !== id)
        setRows(newRows)
        setToast({ open: true, time: 3000, message: 'Xoá người dùng thành công', severity: 'success' })
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        setLoading(false)
      })
  }
  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => deleteUserWithAPI(id) })
  }

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

  //open modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //get data from new criterion
  const [id, setId] = React.useState('')
  const [lname, setName] = React.useState('')
  const [fname, setC] = React.useState('')
  const [email, setD] = React.useState('')
  const submit = e => {
    e.preventDefault()
    setLoading(true)
    handleClose()
    axios.post('/admin/user/add', { id, lname, fname, email }, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        fetchUser().then((res) => {
          setToast({ open: true, time: 3000, message: 'Thêm người dùng thành công', severity: "success" })
          setLoading(false)
        })
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            setToast({ open: true, time: 3000, message: 'Mã người dùng đã tồn tại', severity: "error" })
            break;
          default:
            setToast({ open: true, time: 3000, message: 'Thêm người dùng thất bại', severity: "error" })
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
  // handle toast 
  const [toast, setToast] = useState({ open: false, time: 3000, message: '', severity: '' })
  const handleCloseToast = () => setToast({ ...toast, open: false })
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

  }
  return (<>
    { isLoading ? <Skeleton /> : (
      <>
        <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
        <Toast toast={toast} handleClose={handleCloseToast} />
        <Loading open={loading} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h1" variant="h5" color="inherit" noWrap>
          DANH SÁCH NGƯỜI DÙNG
        </Typography>
        <TextField id="standard-basic" label="Tìm kiếm" onChange={searchUser} />
        </div>
        
        <Paper className={classes.root}>
          <Table className={classes.table} aria-label="caption table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Họ và tên đệm</TableCell>
                <TableCell align="left">Tên</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Đơn vị</TableCell>
                <TableCell align="left">Chức vụ</TableCell>
                <TableCell align="left" />
              </TableRow>
            </TableHead>
            <TableBody>
              {filterUser.length === 0 && <Typography variant='body1' >Không tồn tại người dùng</Typography>}
              {filterUser.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow key={row._id}>
                    <CustomTableCell className={classes.name} {...{ row, name: "staff_id", onChange }} />
                    <CustomTableCell className={classes.name} {...{ row, name: "lastname", onChange }} />
                    <CustomTableCell {...{ row, name: "firstname", onChange }} />
                    <CustomTableCell className={classes.name} {...{ row, name: "email", onChange }} />
                    <CustomTableCell className={classes.name} {...{ row, name: "department", onChange }} />
                    <CustomTableCell className={classes.name} {...{ row, name: "roles", onChange }} />
                    <TableCell className={classes.selectTableCell}>
                      <IconButton
                        aria-label="update"
                        onClick={() => { }}
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
            </TableBody>
          </Table>
          {(rows.length) ? <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          /> : <Typography variant='body1'>Không tồn tại người dùng</Typography>}

          <div style={{ margin: '10px', textAlign: 'right' }}>
            <div>
              <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                Thêm người dùng
           </Button>
              <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                Import file
           </Button>
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
                  <Typography variant='h5' gutterBottom id="transition-modal-title">Thêm người dùng</Typography>
                  <form onSubmit={submit}>
                    <TextField onChange={e => setId(e.target.value)} autoFocus required id="id" label="ID" variant="outlined" fullWidth className={classes.field} />
                    <TextField onChange={e => setName(e.target.value)} required id="lname" label="Họ và tên đệm" variant="outlined" fullWidth className={classes.field} />
                    <TextField onChange={e => setC(e.target.value)} required id="fname" label="Tên" variant="outlined" fullWidth className={classes.field} />
                    <TextField onChange={e => setD(e.target.value)} required id="email" label="Email" multiline variant="outlined" fullWidth className={classes.field} />
                    <FormControl variant="outlined" fullWidth className={classes.formControl}>
                      <InputLabel htmlFor="outlined-newUnit-native">Đơn vị</InputLabel>
                      <Select
                        native
                        required
                        value={newUnit}
                        label='Đơn vị'
                        onChange={handleChangeUnit}
                      >
                        <option aria-label="None" value="" />
                        {units.map(u => <option key={u._id} value={u.department_code}>{u.name}</option>)}
                      </Select>
                    </FormControl>
                    {/* <TextField onChange={e => setP(e.target.value)} id="role" label="Chức vụ" variant="outlined" fullWidth className={classes.field} /> */}
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                      <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >Tạo</Button>
                      <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Thoát</Button>
                    </div>
                  </form>
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
