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

function createData(name, from, to) {
  return { name, from, to };
}

export default function Classify(props) {
  const classes = useStyles();

  const [loading, setLoading] = useState(false)

  const [rows, setRows] = useState([
    createData('Không đạt', 0, 50),
    createData('Trung bình', 50, 60)
  ])

  //edit phân loại
  const [chosen, setChosen] = useState() //index mốc được chọn
  const [info, setInfo] = useState([]) //mảng tạm để lưu trong modal
  const edit = (id) => {
    setChosen(id)
    setInfo([rows[id].name, rows[id].from, rows[id].to])
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
    setRows([...temp])
    handleCloseEdit()
  }

  // xóa phân loại
  const del = (id) => {
    let temp = rows.slice()
    temp.splice(id, 1)
    setRows(temp)
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
    let t = [...rows]
    t.push(createData(name, from, to))
    setRows(t)
    setOpen(false)
  }

  //lưu phân loại
  const save = () => {

  }

  return (
    <div>
      {loading ? <Loading /> : (
        <div>
          <Typography component="h3" variant="h5" color="inherit" style={{ marginBottom: 18 }}>
            Cấu hình xếp loại đánh giá
          </Typography>
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
                {rows.map((row, index) => (
                  <TableRow key={row.name}>
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
            <Button style={{ marginLeft: 24 }} variant="contained" color="secondary" onClick={save}>Lưu</Button>
          </div>
        </div>
      )}
    </div>
  )
}
