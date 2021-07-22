import React, { useState, useEffect } from 'react'

import axios from 'axios'

import Loading from '../../common/Loading'

import { makeStyles } from '@material-ui/core/styles';
import { TextField, Backdrop, Fade, Modal, Button, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'
import DialogConfirm from '../../common/DialogConfirm'

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper1: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minHeight: 20,
  },
  text: {
    width: 150
  }
}))

function createData(id, name, from, to) {
  return { id, name, from, to };
}

export default function Classify(props) {
  const classes = useStyles();
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const [rows, setRows] = useState(null)

  //lấy phân loại từ be
  useEffect(() => {
    axios.get(`/admin/form/${ props.fcode }/formrating`)
      .then(res => {
        // console.log(res.data)
        let t = []
        res.data.formRatings.map(rate => {
          t.push(createData(rate._id, rate.name, rate.min_point, rate.max_point))
        })
        setRows([...t])
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  //edit phân loại
  const [chosen, setChosen] = useState() //index mốc được chọn
  const [info, setInfo] = useState([]) //mảng tạm để lưu trong modal
  const edit = (id) => { //luu y id o day la index trong array rows[]
    setChosen(id)
    setInfo([rows[id].name, rows[id].from, rows[id].to, rows[id].id]) // con .id o day la id cua 1 xep loai, lay tu _id cua db
    handleOpenEdit()
  }
  //modal edit phân loại
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => {
    setOpenEdit(true)
  }
  const handleCloseEdit = () => {
    setOpenEdit(false)
    // console.log(rows)
  }
  const editOnChange = (id, event) => {
    let temp = [...info]
    switch (id) {
      case 0:
        temp[0] = event
        break;
      case 1:
        temp[1] = parseInt(event)
        break;
      case 2:
        temp[2] = parseInt(event)
        break;
      default:
        return null;
    }
    setInfo([...temp])
  }
  const submitEdit = (e) => {
    e.preventDefault()
    let temp = [...rows]
    temp[chosen].name = info[0]
    temp[chosen].from = info[1]
    temp[chosen].to = info[2]
    temp[chosen].id = info[3]
    if (parseInt(temp[chosen].from) > parseInt(temp[chosen].to)) {
      setError("Điểm sau không được nhỏ hơn điểm trước")
      return
    }
    handleCloseEdit()
    setLoading(true)
    axios.post(`/admin/formrating/${ info[3] }/edit`, { name: info[0], min_point: info[1], max_point: info[2] })
      .then(res => {
        setRows([...temp])
        setError("")
        dispatch(showSuccessSnackbar('Cập nhật xếp loại thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        dispatch(showErrorSnackbar('Cập nhật xếp loại thất bại'))
        setError("")
        setLoading(false)
      })
  }

  // xóa phân loại
  const del = (id) => {
    let temp = [...rows]
    // console.log(temp[id].id)
    setLoading(true)
    closeDialog()
    axios.post(`/admin/formrating/${ temp[id].id }/delete`, {})
      .then(res => {
        // console.log(res)
        temp.splice(id, 1)
        setLoading(false)
        setRows(temp)
        dispatch(showSuccessSnackbar('Xoá xếp loại thành công'))
      })
      .catch(err => {
        setLoading(false)
        dispatch(showErrorSnackbar('Xoá xếp loại thất bại'))
        console.log(err)
      })
  }

  //modal thêm phân loại
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('')
  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const [error, setError] = useState()
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  //xác nhận thêm mốc
  const submit = (e) => {
    e.preventDefault()

    if (parseInt(from) > parseInt(to)) {
      setError("Điểm sau không được nhỏ hơn điểm trước")
      return
    }
    setLoading(true)
    setOpen(false)
    axios.post(`/admin/form/${ props.fcode }/formrating`, { name: name, min_point: from, max_point: to })
      .then(res => {
        // console.log(res)
        let t = [...rows]
        t.push(createData(res.data.formRating._id, name, from, to))
        setRows(t)
        setLoading(false)
        dispatch(showSuccessSnackbar('Thêm xếp loại thành công'))
        setError("")
      })
      .catch(err => {
        console.log(err)
        setError("")
        dispatch(showErrorSnackbar('Thêm xếp loại thất bại'))
        setLoading(false)
      })
  }
  // modal xoá
  const [statusDelete, setStatusDelete] = useState({ open: false })
  // xoá user vs api

  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => del(id) })
  }

  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  if (!rows) return <div>
    <Typography component="h3" variant="h5" color="inherit" style={{ marginBottom: 18 }}>
      Cấu hình xếp loại đánh giá
    </Typography><Loading open />
  </div>
  return (
    <div>
      <Loading open={loading} />
      <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
      <Typography component="h3" variant="h5" color="inherit" style={{ marginBottom: 18 }}>
        Cấu hình xếp loại đánh giá
      </Typography>
      <div style={{ minHeight: 250 }}>
        <TableContainer >
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '30%' }} align='left'>Phân loại</TableCell>
                <TableCell style={{ width: '25%' }} align="left">Từ</TableCell>
                <TableCell style={{ width: '25%' }} align="left">Đến</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length == 0 && (
                <TableRow style={{ lineHeight: '60px', paddingLeft: 10 }}><TableCell colSpan={4}>Chưa có phân loại</TableCell></TableRow>
              )}
              {rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell align='left' component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.from}</TableCell>
                  <TableCell align="left">{row.to}</TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="edit">
                      <EditIcon onClick={() => edit(index)} />
                    </IconButton>
                    <IconButton aria-label="delete">
                      <DeleteIcon onClick={() => onDelete(index)} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
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
            <form onSubmit={submit}>
              <Typography variant='h5' gutterBottom>Thêm xếp loại</Typography>
              <TextField required onChange={e => setName(e.target.value)} label="Phân loại" variant="outlined" fullWidth />
              <br />
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                <TextField className={classes.text} required onChange={e => setFrom(parseInt(e.target.value))} label="Từ" type='number' variant="outlined" />
                <TextField className={classes.text} onChange={e => setTo(parseInt(e.target.value))} label="Đến" type='number' variant="outlined" />
              </div>
              <Typography variant='body2' color='secondary'>{error}</Typography>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Button onClick={handleClose} variant="contained" >Thoát</Button>
                &nbsp;&nbsp;
                <Button type="submit" variant="contained" color="primary" >Xong</Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
      <Modal
        className={classes.modal}
        open={openEdit}
        onClose={handleCloseEdit}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openEdit}>
          <div className={classes.paper1}>
            <form onSubmit={submitEdit}>
              <Typography variant='h5' gutterBottom>Cập nhật xếp loại</Typography>
              <TextField required defaultValue={info[0]} onChange={e => editOnChange(0, e.target.value)} label="Phân loại" variant="outlined" fullWidth />
              <br />
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                <TextField className={classes.text} required defaultValue={info[1]} onChange={e => editOnChange(1, e.target.value)} label="Từ" type='number' variant="outlined" />
                <TextField className={classes.text} defaultValue={info[2]} onChange={e => editOnChange(2, e.target.value)} label="Đến" type='number' variant="outlined" />
              </div>
              <Typography variant='body2' color='secondary'>{error}</Typography>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Button onClick={handleCloseEdit} variant="contained" >Thoát</Button>
                &nbsp;&nbsp;
                <Button type="submit" variant="contained" color="primary" >Xong</Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
      <div style={{ marginTop: 24 }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>Thêm xếp loại</Button>
      </div>
    </div>
  )
}

