import React, { useState, useEffect } from 'react';

import { withStyles } from '@material-ui/core/styles';
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
  },
  {
    id: 'point',
    label: 'Tổng điểm',
    minWidth: 40,
    align: 'center',
  },
];

// lam cai var de cho button biet sua xoa vao dung hang cua minh
var index = 0;
var flag = []
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
    console.log(rows)
  }
  const [num, setNum] = React.useState(-1)
  const deleteCriterion = () => {
    flag[index] = 0
    console.log(props.index)
    setNum(props.index);
    rows.splice(props.index, 1)
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
  // const btn = <Btn index={index} />
  const btn = <Btn index={index} />
  flag[index] = 1
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

const useStyles = theme => ({
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
});

class Criterion extends React.Component {
  constructor(props) {
    super(props)

    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.submit = this.submit.bind(this)
    this.setName = this.setName.bind(this)
    this.setId = this.setId.bind(this)
    this.setD = this.setD.bind(this)
    this.setQ = this.setQ.bind(this)
    this.setP = this.setQ.bind(this)
    this.setPage = this.setPage.bind(this)
    this.setRowsPerPage = this.setRowsPerPage.bind(this)
    this.setOpen = this.setOpen.bind(this)
    this.setCriterion = this.setCriterion.bind(this)

    this.state = {
      page: 0,
      rowsPerPage: 5,
      open: false,
      criterion: rows,
      id: '',
      name: '',
      description: '',
      quantity: 0,
      point: 0,
    }
  }

  // shouldComponentUpdate(){
  //   console.log(this.state.criterion)
  //   console.log(rows)
  //   if (this.state.criterion !== rows){
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  //qua trang
  setPage = (newPage) => {
    this.setState({
      page: newPage
    })
  }
  setRowsPerPage = (num) => {
    this.setState({
      rowsPerPage: num
    })
  }

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  handleChangeRowsPerPage = (event) => {
    this.setRowsPerPage(+event.target.value);
    this.setPage(0);
  };
  //them tieu chuan
  setName = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  setId = (e) => {
    this.setState({
      id: e.target.value
    })
  }

  setD = (e) => {
    this.setState({
      description: e.target.value
    })
  }

  setQ = (e) => {
    this.setState({
      quantity: e.target.value
    })
  }

  setP = (e) => {
    this.setState({
      point: e.target.value
    })
  }

  setCriterion = (row) => {
    this.setState({
      criterion: row
    })
  }

  //open modal
  setOpen = (bool) => {
    this.setState({
      open: bool
    })
  }
  handleOpen = () => {
    this.setOpen(true);
  };
  handleClose = () => {
    this.setOpen(false);
  };

  //get data from new criterion
  submit = e => {
    e.preventDefault()
    rows.push(createData(this.state.id, this.state.name, this.state.description, this.state.quantity, this.state.point))
    // // useEffect
    this.setState({
      criterion: rows
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography component="h1" variant="h5" color="inherit" noWrap>
          DANH SÁCH TIÊU CHUẨN
        </Typography>
        <Paper className={classes.root}>
          <Button variant="contained" color="primary" className={classes.btn} onClick={this.handleOpen}>
            Tạo tiêu chuẩn
          </Button>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={this.state.open}
            onClose={this.handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={this.state.open}>
              <div className={classes.paper1}>
                <h2 id="transition-modal-title">Thêm tiêu chuẩn</h2>
                <form onSubmit={this.submit}>
                  <TextField onChange={this.setName} id="name" label="Tên tiêu chuẩn" variant="outlined" fullWidth className={classes.field} />
                  <TextField onChange={this.setId} id="id" label="Mã tiêu chuẩn" variant="outlined" fullWidth className={classes.field} />
                  <TextField onChange={this.setD} id="description" label="Mô tả" multiline variant="outlined" className={classes.field} />
                  <TextField onChange={this.setQ} id="quantity" type='number' label="Số tiêu chí" variant="outlined" fullWidth className={classes.field} />
                  <TextField onChange={this.setP} id="point" type='number' label="Tổng điểm" variant="outlined" fullWidth className={classes.field} />
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >Tạo</Button>
                    <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={this.handleClose}>Thoát</Button>
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
                {this.state.criterion.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align='center'>{row.btn}</TableCell>
                      <TableCell align='center'>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell align='center'>{row.numOfCriteria}</TableCell>
                      <TableCell align='center'>{row.point}</TableCell>
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
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    )
  }
}

export default withStyles(useStyles)(Criterion)