import React, { useState, useEffect } from "react";

import { Link, useParams } from 'react-router-dom';
import ButtonCustom from '../../common/ButtonCustom'
import { makeStyles } from "@material-ui/core/styles";
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
import Toast from '../../common/snackbar'
import Loading from '../../common/Loading'
import Skeleton from '../../common/skeleton'
import DialogConfirm from '../../common/DialogConfirm'

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
  field: {
    marginBottom: 10,
    width: '100%'
  }
}));

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={e => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        name === 'name' ? (<Link to={{ pathname: '/admin/criterion/' + row._id }} style={{ color: 'black' }}>{row[name]}</Link>) : (row[name])
      )}
    </TableCell>
  );
};

export default function Criterion() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem('token')
  const config = { headers: { "Authorization": `Bearer ${token}` } }
  const fetchStandard = () => {
    return axios.get('admin/standard', config)
      .then(res => {
        console.log(res.data.standards)
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

  const [previous, setPrevious] = React.useState([...rows]);
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
    setStatusDelete({ open: true, onClick: () => deleteStandardWithAPI(id) })
  }

  // xoá standard vs api
  const deleteStandardWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/user/${id}/delete`,{},{ headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        const newRows = rows.filter(row => row.code !== id)
        setRows(newRows)
        setToast({ open: true, time: 3000, message: 'Xoá tiêu chuẩn thành công', severity: 'success' })
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        setToast({ open: true, time: 3000, message: 'Xoá tiêu chuẩn thất bại', severity: 'error' })
        setLoading(false)
      })
  }
  // modal xoá
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const closeDialog = () => {
    setStatusDelete({ open: false })
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
  const [name, setName] = React.useState('')
  const [code, setC] = React.useState('')
  const [description, setD] = React.useState('')
  let data = { code, name, description }

  const submit = e => {
    e.preventDefault()
    handleClose()
    setLoading(true)
    axios.post('/admin/standard/add', data, config)
      .then(res => {
        fetchStandard()
          .then(() => {
            setToast({ open: true, time: 3000, message: 'Tạo tiêu chuẩn thành công', severity: "success" })
            setLoading(false)
          })
      })
      .catch(err => {
        switch (err.response?.status) {
          case 409:
            setToast({ open: true, time: 3000, message: 'Mã tiêu chuẩn đã tồn tại', severity: "error" })
            break;
          default:
            setToast({ open: true, time: 3000, message: 'Tạo tiêu chuẩn thất bại', severity: "error" })
            break;
        }
        setLoading(false)
      })
  }
  // loading add criterion
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ open: false, time: 3000, message: '', severity: '' })
  const handleCloseToast = () => setToast({ ...toast, open: false })

  return (
    <>
      { isLoading ? <Skeleton /> :
        <div>
          <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
          <Toast toast={toast} handleClose={handleCloseToast} />
          <Loading open={loading} />
          <Typography component="h1" variant="h5" color="inherit" noWrap>
            DANH SÁCH TIÊU CHUẨN
          </Typography>
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                  <TableCell className={classes.number} align="left">Mã TC</TableCell>
                  <TableCell className={classes.name} align="left">Tên tiêu chuẩn</TableCell>
                  <TableCell align="left">Mô tả</TableCell>
                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow key={row._id}>
                      <CustomTableCell {...{ row, name: "code", onChange }} />
                      <CustomTableCell {...{ row, name: "name", onChange }} />
                      <CustomTableCell {...{ row, name: "description", onChange }} />
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
                              onClick={() => onDelete(row.code)}
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
              <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                Tạo tiêu chuẩn mới
              </Button>
              <Modal
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
                    <Typography variant="h5" gutterBottom color="inherit" noWrap>Thêm tiêu chuẩn</Typography>
                    <form onSubmit={submit}>
                      <TextField autoFocus required onChange={e => setC(e.target.value)} id="code" label="Mã tiêu chuẩn" variant="outlined" fullWidth className={classes.field} />
                      <TextField required onChange={e => setName(e.target.value)} id="name" label="Tên tiêu chuẩn" variant="outlined" fullWidth className={classes.field} />
                      <TextField onChange={e => setD(e.target.value)} id="description" label="Mô tả" multiline variant="outlined" className={classes.field} />
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary">Tạo</Button>
                        <Button style={{ marginRight: '10px' }} handleButtonClick={handleClose} onClick={handleClose} variant="contained" color="primary">Thoát</Button>
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
