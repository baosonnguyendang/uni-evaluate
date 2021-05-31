import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { useParams } from 'react-router-dom';

import { makeStyles } from "@material-ui/core/styles";
import Link from '@material-ui/core/Link'
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
    width: '40%',
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

const createData = (name, code, description, point) => ({
  id: code,
  name,
  code,
  description,
  point,
  isEditMode: false
});

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
        row[name]
      )}
    </TableCell>
  );
};

// component={Link} href={window.location.href + '/a'}

export default function Selection() {
  const [rows, setRows] = React.useState(null);
  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();
  const { id } = useParams();
  //token
  const token = localStorage.getItem('token');
  const config = { headers: { "Authorization": `Bearer ${token}` } };

  const fetchSelection = () => {
    axios.get(`/admin/criteria/${id}/option`, config)
      .then(res => {
        const selections = res.data.criteriaOptions;
        console.log(selections)
        setRows(res.data.criteriaOptions)
        // setIsLoading(false)
      })
  }
  useEffect(() => {
    fetchSelection()
  }, [])

  const onToggleEditMode = id => {
    setRows(state => {
      return rows.map(row => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious(state => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    let { id } = row;
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };
  // modal xoá
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => deleteOptionWithAPI(id) })
  }
  // delete options
  const deleteOptionWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/criteria/option/${id}/delete`, {}, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        const newRows = rows.filter(row => row.code !== id)
        setRows(newRows)
        setToast({ open: true, time: 3000, message: 'Xoá lựa chọn thành công', severity: 'success' })
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        setToast({ open: true, time: 3000, message: 'Xoá lựa chọn thất bại', severity: 'error' })
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
  };
  const onEdit = id => {
    rows.forEach(u => {
      if (u.code === id) {
        setCode(id)
        setName(u.name)
        setDescription(u.description)
        setPoint(u.max_point)
      }
    })
    setModal({ open: true, id })
  }
  const editSelection = (e, id) => {
    e.preventDefault()
    const body = { new_ocode: code, name, description, max_point: point }
    setLoading(true)
    console.log(modal.id)

    handleClose()
    axios.post(`/admin/criteria/option/${id}/edit`, body, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setRows(rows.map(r => r.code === id ? { ...r, code, name, description } : r))
        setToast({ open: true, time: 3000, message: 'Cập nhật lựa chọn thành công', severity: "success" })
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            setToast({ open: true, time: 3000, message: 'Mã lựa chọn đã tồn tại', severity: "error" })
            break;
          default:
            setToast({ open: true, time: 3000, message: 'Cập nhật lựa chọn thất bại', severity: "error" })
            break;
        }
        setLoading(false)
      })
  }
  // loading add selection
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ open: false, time: 3000, message: '', severity: '' })
  const handleCloseToast = () => setToast({ ...toast, open: false })

  // Tạo lựa chọn
  const submitAddSelection = (e) => {
    console.log(code, name, description, point);
    handleClose();
    setLoading(true)
    e.preventDefault()
    const body = {
      code,
      name,
      max_point: point,
      description
    }
    axios.post(`/admin/criteria/${id}/addCriteriaOption`, body, config)
      .then(res => {
        console.log(res.data);
        setRows(row => [...row, { name, code, description, max_point: point }])
        setToast({ open: true, time: 3000, message: 'Tạo lựa chọn thành công', severity: "success" })
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            setToast({ open: true, time: 3000, message: 'Mã lựa chọn đã tồn tại', severity: "error" })
            break;
          default:
            setToast({ open: true, time: 3000, message: 'Tạo lựa chọn thất bại', severity: "error" })
            break;
        }
        setLoading(false)
      })
  }

  //get data from new criterion
  const [name, setName] = React.useState('')
  const [code, setCode] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [point, setPoint] = React.useState(0)

  function Criteria() {
    let { id } = useParams();
    return (
      < Typography component="h1" variant="h5" color="inherit" noWrap >
        Tiêu chí { id} - DS lựa chọn
      </Typography >
    )
  }

  return (
    <>
      {!rows ? <Skeleton /> :
        <div>
          <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
          <Toast toast={toast} handleClose={handleCloseToast} />
          <Loading open={loading} />
          <Criteria />
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                  <TableCell className={classes.number} >Mã </TableCell>
                  <TableCell className={classes.name} >Lựa chọn </TableCell>
                  <TableCell className={classes.description}>Mô tả</TableCell>
                  <TableCell >Điểm</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row._id}>
                    <CustomTableCell className={classes.name} {...{ row, name: "code", onChange }} />
                    <CustomTableCell className={classes.number} {...{ row, name: "name", onChange }} />
                    <CustomTableCell {...{ row, name: "description", onChange }} />
                    <CustomTableCell {...{ row, name: "max_point", onChange }} />
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
                {rows.length === 0 && <TableRow><TableCell colSpan={5}>Không có lựa chọn</TableCell></TableRow>}
              </TableBody>
            </Table>
            <div style={{ margin: 10, justifyContent: 'space-between', display: 'flex' }}>
              <Button variant="contained" className={classes.btn} onClick={handleOpen}>
                Khôi phục
              </Button>
              <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                Thêm lựa chọn
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
                    <Typography variant='h5' gutterBottom id="transition-modal-title">{modal.id ? "Cập nhật lựa chọn" : 'Thêm lựa chọn'}</Typography>
                    <form onSubmit={modal.id ? ((e) => editSelection(e, modal.id)) : submitAddSelection}>
                      <TextField onChange={e => setCode(e.target.value)} id="code" label="Mã" variant="outlined" fullWidth autoFocus required margin='normal' defaultValue={modal.id && code} />
                      <TextField onChange={e => setName(e.target.value)} id="name" label="Tên" variant="outlined" fullWidth required margin='normal' defaultValue={modal.id && name} />
                      <TextField onChange={e => setDescription(e.target.value)} id="description" label="Mô tả" multiline fullWidth variant="outlined" margin='normal' defaultValue={modal.id && description} />
                      <TextField onChange={e => setPoint(e.target.value)} id="point" label="Điểm" type="number" fullWidth required variant="outlined" margin='normal' defaultValue={modal.id && point} />
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Button style={{ marginRight: '10px' }} variant="contained" color="primary" type='submit' >{modal.id ? "Cập nhật" : 'Tạo'}</Button>
                        <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Thoát</Button>
                      </div>
                    </form>
                  </div>
                </Fade>
              </Modal>
            </div>
          </Paper>
        </div>
      }
    </>
  );
}
