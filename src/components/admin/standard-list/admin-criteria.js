import React, { useEffect, useState } from "react";
import { Link, useParams, useRouteMatch } from 'react-router-dom';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
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

import axios from 'axios'
import Toast from '../../common/snackbar'
import Loading from '../../common/Loading'
import Skeleton from '../../common/skeleton'
import DialogConfirm from '../../common/DialogConfirm'
import { ErrorSharp } from "@material-ui/icons";

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
}));

const CustomTableCell = ({ row, name }) => {
  const classes = useStyles();
  let { url } = useRouteMatch();

  return (
    <TableCell align="left" className={classes.tableCell}>
      {
        name === 'name' ? (<Link to={`${url}/${row['code']}`} style={{ color: 'black' }}>{row[name]}</Link>) : (row[name])
      }
    </TableCell>
  );
};

export default function Criteria() {
  const [rows, setRows] = React.useState(null);
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem('token')
  const config = { headers: { "Authorization": `Bearer ${token}` } }
  const { id } = useParams()
  const [nameStandard, setNameStandard] = useState('')
  const fetchCriteriaOfStandard = () => {
    axios.get(`admin/standard/${id}/criteria`, config)
      .then(res => {
        console.log(res.data.criterions)
        setRows(res.data.criterions)
        setNameStandard(res.data.standard.name)
        setIsLoading(false)
      })
  }
  useEffect(() => {
    fetchCriteriaOfStandard()
  }, [])

  // loading add criterion
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ open: false, time: 3000, message: '', severity: '' })
  const handleCloseToast = () => setToast({ ...toast, open: false })

  // modal xoá
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => deleteCriteriaWithAPI(id) })
  }

  // xoá standard vs api
  const deleteCriteriaWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/criteria/${id}/delete`, {}, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        const newRows = rows.filter(row => row.code !== id)
        setRows(newRows)
        setToast({ open: true, time: 3000, message: 'Xoá tiêu chí thành công', severity: 'success' })
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        setToast({ open: true, time: 3000, message: 'Xoá tiêu chí thất bại', severity: 'error' })
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
    console.log(modal.id)

    handleClose()
    axios.post(`/admin/standard/${id}/edit`, body, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setRows(rows.map(r => r.code === id ? { ...r, code, name, description, type } : r))
        setToast({ open: true, time: 3000, message: 'Cập nhật tiêu chí thành công', severity: "success" })
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            setToast({ open: true, time: 3000, message: 'Mã tiêu chí đã tồn tại', severity: "error" })
            break;
          default:
            setToast({ open: true, time: 3000, message: 'Cập nhật tiêu chí thất bại', severity: "error" })
            break;
        }
        setLoading(false)
      })
  }

  //sumbit form tao tieu chi
  const submitAddCriteria = (e) => {
    console.log(code, name, description, type);
    e.preventDefault()
    setLoading(true)
    handleClose()
    const body = {
      name,
      code,
      description,
      type
    }
    axios.post(`/admin/standard/${id}/criteria/add`, body, config)
      .then(res => {
        // chỗ này success thì fe tạo bảng
        console.log(res.data);
        setRows(row => [...row, { name, code, description, type }])
        setToast({ open: true, time: 3000, message: 'Tạo tiêu chí thành công', severity: "success" })
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            setToast({ open: true, time: 3000, message: 'Mã tiêu chí đã tồn tại', severity: "error" })
            break;
          default:
            setToast({ open: true, time: 3000, message: 'Tạo tiêu chí thất bại', severity: "error" })
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
    setType(event.target.value);
  };

  return (
    <>
      {isLoading ? <Skeleton /> : (
        <div>
          <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
          <Toast toast={toast} handleClose={handleCloseToast} />
          <Loading open={loading} />
          <Typography component="h1" variant="h5" color="inherit" noWrap >
            Tiêu chuẩn {nameStandard} - DS Tiêu chí
          </Typography >
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                  <TableCell className={classes.number} >Mã tiêu chí</TableCell>
                  <TableCell className={classes.name} >Tên tiêu chí</TableCell>
                  <TableCell className={classes.description}>Mô tả</TableCell>
                  <TableCell >Kiểu đánh giá</TableCell>
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
                      <IconButton
                        aria-label="delete"
                        onClick={() => onEdit(row.code)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => onDelete(row.code)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && <TableRow><TableCell colSpan={5}>Không có tiêu chí</TableCell></TableRow>}
              </TableBody>
            </Table>
            <div style={{ margin: 10, justifyContent: 'space-between', display: 'flex' }}>
              <Button variant="contained" className={classes.btn} onClick={handleOpen}>
                Khôi phục
              </Button>
              <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                Tạo tiêu chí mới
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
                    <Typography variant='h5' gutterBottom id="transition-modal-title">{modal.id ? "Cập nhật tiêu chí" : 'Thêm tiêu chí'}</Typography>
                    <form onSubmit={modal.id ? ((e) => editCriteria(e, modal.id)) : submitAddCriteria}>
                      <TextField onChange={e => setCode(e.target.value)} id="code" required label="Mã tiêu chí" variant="outlined" fullWidth autoFocus margin='normal' defaultValue={modal.id && code} />
                      <TextField onChange={e => setName(e.target.value)} id="name" required label="Tên tiêu chí" variant="outlined" fullWidth margin='normal' defaultValue={modal.id && name} />
                      <TextField onChange={e => setDescription(e.target.value)} id="description" label="Mô tả" multiline fullWidth variant="outlined" margin='normal' defaultValue={modal.id && description} />
                      <FormControl fullWidth variant="outlined" margin='normal' >
                        <InputLabel >Kiểu đánh giá</InputLabel>
                        <Select
                          native
                          required
                          value={type}
                          label='Kiểu đánh giá'
                          onChange={handleChangeType}
                        >
                          <option aria-label="None" value="" />
                          <option value={'checkbox'}>Checkbox</option>
                          <option value={'radio'}>Radio</option>
                          <option value={'input'}>Input</option>
                        </Select>
                      </FormControl>
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary">{modal.id ? "Cập nhật" : 'Tạo'}</Button>
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

  );
}
