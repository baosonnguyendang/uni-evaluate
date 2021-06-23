import React, { useState, useEffect } from 'react'

import axios from 'axios'

import Loading from '../../common/CircleLoading'

import { makeStyles } from '@material-ui/core/styles';
import { TextField, Backdrop, Fade, Modal, Button, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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

  const [loading, setLoading] = useState(false)

  const [rows, setRows] = useState([])

  //lấy phân loại từ be
  useEffect(() => {
    axios.get(`/admin/form/${props.fcode}/formrating`)
      .then(res => {
        console.log(res.data)
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
    console.log(rows)
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
    axios.post(`/admin/formrating/${info[3]}/edit`, { name: info[0], min_point: info[1], max_point: info[2] })
      .then(res => {
        setRows([...temp])
        handleCloseEdit()
      })
      .catch(err => {
        console.log(err)
        handleCloseEdit()
      })
  }

  // xóa phân loại
  const del = (id) => {
    let temp = [...rows]
    console.log(temp[id].id)
    axios.post(`/admin/formrating/${temp[id].id}/delete`, {})
      .then(res => {
        console.log(res)
        temp.splice(id, 1)
        setRows(temp)
      })
      .catch(err => {
        console.log(err)
      })
  }

  //modal thêm phân loại
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('')
  const [from, setFrom] = useState()
  const [to, setTo] = useState()
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  //xác nhận thêm mốc
  const submit = (e) => {
    e.preventDefault()
    axios.post(`/admin/form/${props.fcode}/formrating`, { name: name, min_point: from, max_point: to })
      .then(res => {
        console.log(res)
        let t = [...rows]
        t.push(createData(res.data.formRating._id, name, from, to))
        setRows(t)
        setOpen(false)
      })
      .catch(err => {
        console.log(err)
        setOpen(false)
      })
  }

  return (
    <div>
      {loading ? <Loading /> : (
        <div>
          <Typography component="h3" variant="h5" color="inherit" style={{ marginBottom: 18 }}>
            Cấu hình xếp loại đánh giá
          </Typography>
          <div style={{minHeight: 250}}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align='center'>Phân loại</TableCell>
                  <TableCell align="right">Từ</TableCell>
                  <TableCell align="right">Đến</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length == 0 && (
                  <TableRow style={{ lineHeight: '60px', paddingLeft: 10 }}><TableCell colSpan={4}>Chưa có phân loại</TableCell></TableRow>
                )}
                {rows.map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell align='center' component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.from}</TableCell>
                    <TableCell align="right">{row.to}</TableCell>
                    <TableCell align="center">
                      <IconButton aria-label="edit">
                        <EditIcon onClick={() => edit(index)} />
                      </IconButton>
                      <IconButton aria-label="delete">
                        <DeleteIcon onClick={() => del(index)} />
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
                  <h3>Thêm mốc</h3>
                  <TextField required onChange={e => setName(e.target.value)} label="Phân loại" variant="outlined" fullWidth />
                  <br />
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                    <TextField className={classes.text} onChange={e => setFrom(e.target.value)} label="Từ" type='number' variant="outlined" />
                    <TextField className={classes.text} onChange={e => setTo(e.target.value)} label="Đến" type='number' variant="outlined" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '0 20%' }}>
                    <Button type="submit" variant="contained" color="primary" >Xong</Button>
                    <Button onClick={handleClose} variant="contained" color="primary" >Thoát</Button>
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
                  <h3>Sửa mốc</h3>
                  <TextField required defaultValue={info[0]} onChange={e => editOnChange(0, e.target.value)} label="Phân loại" variant="outlined" fullWidth />
                  <br />
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                    <TextField className={classes.text} defaultValue={info[1]} onChange={e => editOnChange(1, e.target.value)} label="Từ" type='number' variant="outlined" />
                    <TextField className={classes.text} defaultValue={info[2]} onChange={e => editOnChange(2, e.target.value)} label="Đến" type='number' variant="outlined" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-evenly', margin: '0 20%' }}>
                    <Button type="submit" variant="contained" color="primary" >Xong</Button>
                    <Button onClick={handleCloseEdit} variant="contained" color="primary" >Thoát</Button>
                  </div>
                </form>
              </div>
            </Fade>
          </Modal>
          <div style={{ marginTop: 24 }}>
            <Button variant="contained" color="primary" onClick={handleOpen}>Thêm mốc</Button>
          </div>
        </div>
      )}
    </div>
  )
}

