// import * as React from 'react';
// import { DataGrid } from '@material-ui/data-grid';
// import Button from '@material-ui/core/Button';
// import Paper from '@material-ui/core/Paper';

// const columns = [
//   { field: 'id', headerName: 'ID', width: 70 },
//   { field: 'name', headerName: 'Tên tiêu chuẩn', width: 200 },
//   { field: 'description', headerName: 'Mô tả', width: 350 },
//   {
//     field: 'numOfCriteria',
//     headerName: 'Số tiêu chí',
//     type: 'number',
//     width: 150,
//   },
//   {
//     field: 'point',
//     headerName: 'Tổng điểm',
//     width: 180,
//   },
// ];

// const rows = [
//   { id: 1, name: 'Snow', description: 'Jon', numOfCriteria: 35 },
//   { id: 2, name: 'Lannister', description: 'Cersei', numOfCriteria: 42 },
//   { id: 3, name: 'Lannister', description: 'Jaime', numOfCriteria: 45 },
//   { id: 4, name: 'Stark', description: 'Arya', numOfCriteria: 16 },
// ];

// export default class Criterion extends React.Component {
//   render() {
//     const paper = {
//       height: 400,
//       width: '100%',
//       padding: '5px 10px 10px 10px'
//     };

//     return (
//       <Paper style={paper}>
//         <DataGrid rows={rows} columns={columns} pageSize={10} />
//       </Paper>
//     );
//   }
// }

import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import EditIcon from '@material-ui/icons/Edit';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const columns = [
  { id: 'btn', label: 'Thao tác', minWidth: 100, align: 'center' },
  { id: 'id', label: 'Mã\u00a0tiêu\u00a0chuẩn', minWidth: 40, align: 'center' },
  { id: 'name', label: 'Tên\u00a0tiêu\u00a0chuẩn', minWidth: 250 },
  {
    id: 'description',
    label: 'Mô\u00a0tả',
    minWidth: 280,
    // format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'numOfCriteria',
    label: 'Số tiêu chí',
    minWidth: 40,
    align: 'center',
    type: 'number',
  },
  {
    id: 'point',
    label: 'Tổng điểm',
    minWidth: 40,
    align: 'center',
    type: 'number',
  },
];

// lam cai var de cho button biet sua xoa vao dung hang cua minh
var index = 0;
/*  */


function Btn(props) {
  // const [bool, setBool] = useState(true);

  // const editCriterion = () => {
  //   console.log(rows)
  // }

  // const deleteCriterion = React.memo(() => {
  //   rows.splice(props.index, 1)
  // })

  const editCriterion = () => {

  }
  const [num, setNum] = React.useState(-1)
  const deleteCriterion = () => {
    
    console.log(props.index)
    setNum(props.index);
    rows.splice(props.index, 1)
    console.log(num)
    alert(num)
  }

  return (
    <div>
      <Button onClick={editCriterion} variant="contained" color="primary" style={{ marginRight: '5px' }} startIcon={<EditIcon />} size="small">
        Sửa
      </Button>
      <Button onClick={deleteCriterion} variant="contained" color="secondary" endIcon={<DeleteIcon />} size="small">
        Xóa
      </Button>
    </div>
  )


}

function createData(id, name, description, numOfCriteria, point) {
  const btn = <Btn index={index} />

  index++;
  return { btn, id, name, description, numOfCriteria, point }
}

const rows = [
  createData('TC001', 'Hoạt động giảng dạy', 'Mô tả', 3, 42),
  createData('TC002', 'Hoạt động khoa học', 'Mô tả', 1, 32),
  createData('TC003', 'Hoạt động chuyên môn khác', 'Mô tả', 4, 10),
  createData('TC004', 'Kiến thức, kỹ năng bổ trợ', 'Mô tả', 2, 6),
  createData('TC005', 'Hoạt động đoàn thể, cộng đồng', 'Mô tả', 2, 10),
  createData('TC011', 'Hoạt động chuyên môn', 'Mô tả', 3, 60),
  createData('TC012', 'Ý thức, thái độ làm việc', 'Mô tả', 2, 20),
  createData('TC013', 'Kiến thức, kỹ năng bổ trợ', 'Mô tả', 2, 10),
  createData('TC014', 'Hoạt động đoàn thể, cộng đồng', 'Mô tả', 2, 10),
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: '15px'
  },
  btn: {
    textTransform: 'none',
    margin: '15px',
    float: 'right'
  },
  container: {
    maxHeight: 440,
    border: '1px solid #f4f4f4',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper1: {
    position: 'absolute',
    // padding: '10px',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  field: {
    marginBottom: '8px',
  },
}));

export default function Criterion() {
  const classes = useStyles();

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
  const [criterion, setCriterion] = React.useState(rows)
  const [name, setName] = React.useState('')
  const [id, setId] = React.useState('')
  const [description, setD] = React.useState('')
  const [quantity, setQ] = React.useState(0)
  const [point, setP] = React.useState(0)
  const submit = e => {
    e.preventDefault()
    rows.push(createData(id, name, description, quantity, point))
    // // useEffect
    setCriterion(rows)
    alert('Đã thêm tiêu chuẩn, vui lòng nhấn "Thoát"')
  }

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        DANH SÁCH TIÊU CHUẨN
      </Typography>
      <Paper className={classes.root}>
        <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
          Tạo tiêu chuẩn
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
                <TextField onChange={e => setId(e.target.value)} id="id" label="Mã tiêu chuẩn" variant="outlined" fullWidth className={classes.field} />
                <TextField onChange={e => setD(e.target.value)} id="description" label="Mô tả" multiline variant="outlined" className={classes.field} />
                <TextField onChange={e => setQ(e.target.value)} id="quantity" type='number' label="Số tiêu chí" variant="outlined" fullWidth className={classes.field} />
                <TextField onChange={e => setP(e.target.value)} id="point" type='number' label="Tổng điểm" variant="outlined" fullWidth className={classes.field} />
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >Tạo</Button>
                  <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Thoát</Button>
                </div>
              </form>
            </div>
          </Fade>
        </Modal>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table" id='table'>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {criterion.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  )
}