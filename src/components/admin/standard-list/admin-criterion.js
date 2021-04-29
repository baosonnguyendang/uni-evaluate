import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { Link } from 'react-router-dom';

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

const createData = (name, code, description, numOfCriteria, point) => ({
  id: code,
  name,
  code,
  description,
  numOfCriteria,
  point,
  isEditMode: false
});

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
        name === 'name' ? (<Link to={{pathname: '/admin/criterion/' + row._id}}  style={{ color: 'black' }}>{row[name]}</Link>) : (row[name])
      )}
    </TableCell>
  );
};

export default function Criterion() {
  const [rows, setRows] = React.useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem('token')
  const config = { headers: {"Authorization" : `Bearer ${token}`} }
  const fetchStandard = () => {
    axios.get('admin/standard',config)
      .then(res => {
        console.log(res.data.standards)
        setRows(res.data.standards)
        setIsLoading(false)
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
    axios.post(`admin/standard/${id}/delete`,{id},config)
      .then( res => {
        console.log(res.data)
        const newRows = rows.filter(row => row._id !== id)
        setRows(newRows)
        setMessage(res.data.message)
        handleOpenToast()

      })
  }

  const onRevert = id => {
    console.log(rows)
    console.log(previous)
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

  const [openToast, setOpenToast] = useState(false)
  const handleOpenToast = () => {
    setOpenToast(true);
  };
  const handleCloseToast = () => {
    setOpenToast(false);
  };
  const [message, setMessage] = React.useState('');
  //get data from new criterion
  const [name, setName] = React.useState('')
  const [code, setC] = React.useState('')
  const [description, setD] = React.useState('')
  let data = {code,name,description}
  const submit = e => {
    e.preventDefault()
   return(   axios.post('/admin/standard/add',data,config)
   .then(res => {
     // setMessage("res.data.message")
     // handleClose()
     // handleOpenToast()
     // setRows(rows => [...rows, data])
     console.log(res);

     })
     .catch((e)=> {console.log(e)}))
   
    
    

  }

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        DANH SÁCH TIÊU CHUẨN
      </Typography>
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="caption table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#f4f4f4' }}>
              <TableCell align="left" />
              <TableCell className={classes.name} align="left">Tên tiêu chuẩn</TableCell>
              <TableCell className={classes.number} align="left">Mã TC</TableCell>
              <TableCell align="left">Mô tả</TableCell>
              <TableCell className={classes.number} align="left">Số tiêu chí</TableCell>
              <TableCell className={classes.number} align="left">Tổng điểm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow key={row._id}>
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
                  <CustomTableCell {...{ row, name: "name", onChange }} />
                  <CustomTableCell {...{ row, name: "code", onChange }} />
                  <CustomTableCell {...{ row, name: "description", onChange }} />
                  <CustomTableCell {...{ row, name: "numOfCriteria", onChange }} />
                  <CustomTableCell {...{ row, name: "point", onChange }} />
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
                <h2 id="transition-modal-title">Thêm tiêu chuẩn</h2>
                <form onSubmit={submit}>
                  <TextField onChange={e => setName(e.target.value)} id="name" label="Tên tiêu chuẩn" variant="outlined" fullWidth className={classes.field} />
                  <TextField onChange={e => setC(e.target.value)} id="code" label="Mã tiêu chuẩn" variant="outlined" fullWidth className={classes.field} />
                  <TextField onChange={e => setD(e.target.value)} id="description" label="Mô tả" multiline variant="outlined" className={classes.field} />                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >Tạo</Button>
                  <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Thoát</Button>
                  </div>
                </form>
              </div>
            </Fade>
          </Modal>
        </div>
      </Paper>
      <Toast open={openToast} time={2000} message={message} severity='success' handleClose={handleCloseToast} />
    </div>
  );
}
