import React, { useState, useEffect } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from '@material-ui/core/TablePagination';
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import Typography from '@material-ui/core/Typography';
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import { Link } from 'react-router-dom'
import Loading from '../../common/Loading'
import Skeleton from '../../common/Skeleton'
import DialogConfirm from '../../common/DialogConfirm'
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
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
  },
  btn: {
    marginRight: 5,
    minWidth: 180,
  },
  btnback: {
    marginTop: theme.spacing(1),
    width: 80,
    color: '#212121',
    "&:hover": {
      color: '#212121'
    }
  }
}));
const CustomTableCell = ({ row, name }) => {
  const classes = useStyles();
  return (
    <TableCell align="left" className={classes.tableCell}>
      {row[name]}
    </TableCell>
  );
};

const DeletedUser = () => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const [rows, setRows] = React.useState(null);

  const fetchDeletedUser = () => {
    return axios.get('/admin/user/deleted')
      .then(res => {
        setRows(res.data.users.map(user => ({ ...user, department: user.department.map(dep => dep.name).join(", ") })))
      })
      .catch(e => {
        console.log(e.response)
      })
  }
  useEffect(() => {
    fetchDeletedUser()
  }, [])
  // loading restore criteron
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ open: false, time: 3000, message: '', severity: '' })
  const handleCloseToast = () => setToast({ ...toast, open: false })
  // modal xoá
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  const onRestore = id => {
    setStatusDelete({ open: true, onClick: () => restoreUserWithAPI(id) })
  }
  // khôi phục người dùng vs api
  const restoreUserWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/user/${ id }/restore`, {})
      .then(res => {
        const newRows = rows.filter(row => row.staff_id !== id)
        // console.log(newRows)
        setRows(newRows)
        dispatch(showSuccessSnackbar('Khôi phục người dùng thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Khôi phục người dùng thất bại'))
        setLoading(false)
      })
  }

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

  if (!rows)
    return <Skeleton />
  return (
    <>
      <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} text='Bạn muốn khôi phục ?' />
      <Loading open={loading} />
      <Typography component="h1" variant="h5" color="inherit" noWrap >
        Danh sách người dùng đã xoá
      </Typography >
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="caption table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#f4f4f4' }}>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Họ và tên đệm</TableCell>
              <TableCell align="left">Tên</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell style={{ width: '20%' }} align="left">Đơn vị</TableCell>
              <TableCell align="left">Vai trò</TableCell>
              <TableCell align="left" />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              // console.log(row)
              return (
                <TableRow key={row._id}>
                  <CustomTableCell {...{ row, name: "staff_id", }} />
                  <CustomTableCell {...{ row, name: "lastname", }} />
                  <CustomTableCell {...{ row, name: "firstname", }} />
                  <CustomTableCell {...{ row, name: "email", }} />
                  <CustomTableCell {...{ row, name: "department", }} />
                  <CustomTableCell {...{ row, name: "roles", }} />
                  <TableCell align='right' className={classes.selectTableCell}>
                    <Tooltip title='Khôi phục'>
                      <IconButton
                        aria-label="restore"
                        onClick={() => onRestore(row.staff_id)}
                        style={{ marginRight: '10px' }}
                      >
                        <RestoreFromTrashIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })}
            {rows.length === 0 && <TableRow><TableCell colSpan={7}>Không có người dùng</TableCell></TableRow>}
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
      </Paper>
      <Link to="/admin/user" component={Button} className={classes.btnback} variant="contained" style={{ float: 'right' }} ><KeyboardReturnIcon /></Link>
    </>
  )
}

export default DeletedUser
