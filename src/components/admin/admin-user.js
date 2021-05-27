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

const createData = (id, lname, fname, email, unit, role) => ({
  id, lname, fname, email, unit, role, isEditMode: false
})

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
  const [previous, setPrevious] = React.useState([]);
  const fetchUser = () => {
    axios.get('/admin/user', { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data.users);
        setRows(res.data.users.map(user => ({ ...user, department: user.department.map(dep => dep.name).join(", "), isEditMode: false })))
        setPrevious([...rows])
        setIsLoading(false)
      })
  }
  useEffect(() => {
    fetchUser()
  }, [])

  console.log(previous)
  const classes = useStyles();

  const onToggleEditMode = id => {
    setPrevious([...rows])
    setRows(state => {
      return rows.map(row => {
        if (row._id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

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

  const onDelete = id => {
    const newRows = rows.filter(row => row._id !== id)
    setRows(newRows)
  }

  const onRevert = id => {
    setRows([...previous]);
  };

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
        fetchUser().then(() => {
          setToast({ open: true, time: 3000, message: 'Thêm người dùng thành công', severity: "success" })
          setLoading(false)
        })
      })
      .catch(err => {
        switch (err.response.status) {
          case 409:
            setToast({ open: true, time: 3000, message: 'Người dùng đã tồn tại', severity: "error" })
            break;
          default:
            setToast({ open: true, time: 3000, message: 'Thêm người dùng thất bại', severity: "error" })
            break;
        }
        setLoading(false)
      })
  }

  //chon don vi trong modal
  // const [newUnit, setNewUnit] = React.useState('');
  // const handleChangeUnit = (event) => {
  //   setNewUnit(event.target.value); 
  // };
  const [isLoading, setIsLoading] = React.useState(true)
  // handle toast 
  const [toast, setToast] = useState({ open: false, time: 3000, message: '', severity: '' })
  const handleCloseToast = () => setToast({ ...toast, open: false })
  const [loading, setLoading] = useState(false)
  return (<>
    { isLoading ? <Skeleton /> : (
      <div>
        <Toast toast={toast} handleClose={handleCloseToast} />
        <Loading open={loading} />
        <Typography component="h1" variant="h5" color="inherit" noWrap>
          DANH SÁCH NGƯỜI DÙNG
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
                <TableCell align="left">Chức vụ</TableCell>
                <TableCell align="left" />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow key={row._id}>
                    <CustomTableCell className={classes.name} {...{ row, name: "staff_id", onChange }} />
                    <CustomTableCell className={classes.name} {...{ row, name: "lastname", onChange }} />
                    <CustomTableCell {...{ row, name: "firstname", onChange }} />
                    <CustomTableCell className={classes.name} {...{ row, name: "email", onChange }} />
                    <CustomTableCell className={classes.name} {...{ row, name: "department", onChange }} />
                    <CustomTableCell className={classes.name} {...{ row, name: "roles", onChange }} />
                    <TableCell className={classes.selectTableCell}>
                      {row.isEditMode ? (
                        <>
                          <IconButton
                            aria-label="done"
                            onClick={() => onToggleEditMode(row._id)}
                          >
                            <DoneIcon />
                          </IconButton>
                          <IconButton
                            aria-label="revert"
                            onClick={() => onRevert(row._id)}
                          >
                            <RevertIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            aria-label="delete"
                            onClick={() => onToggleEditMode(row._id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => onDelete(row._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
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
                  <h2 id="transition-modal-title">Thêm người dùng</h2>
                  <form onSubmit={submit}>
                    <TextField onChange={e => setId(e.target.value)} required id="id" label="ID" variant="outlined" fullWidth className={classes.field} />
                    <TextField onChange={e => setName(e.target.value)} required id="lname" label="Họ và tên đệm" variant="outlined" fullWidth className={classes.field} />
                    <TextField onChange={e => setC(e.target.value)} required id="fname" label="Tên" variant="outlined" fullWidth className={classes.field} />
                    <TextField onChange={e => setD(e.target.value)} required id="email" label="Email" multiline variant="outlined" fullWidth className={classes.field} />
                    {/* <FormControl variant="outlined" fullWidth className={classes.formControl}>
                   <InputLabel htmlFor="outlined-newUnit-native">Đơn vị</InputLabel>
                   <Select
                     native
                     required
                     value={newUnit}
                     label='Đơn vị'
                     onChange={handleChangeUnit}
                   >
                     <option aria-label="None" value="" />
                     <option value={10}>Phòng Đào tạo</option>
                     <option value={20}>Khoa Máy tính</option>
                     <option value={30}>Phòng Y tế</option>
                   </Select>
                 </FormControl>
                 <TextField onChange={e => setP(e.target.value)} id="role" label="Chức vụ" variant="outlined" fullWidth className={classes.field} /> */}
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
      </div>
    )}
  </>
  )
}
