import React, { useState, useEffect } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import Typography from '@material-ui/core/Typography';

import Loading from '../../common/Loading'
import Skeleton from '../../common/Skeleton'
import DialogConfirm from '../../common/DialogConfirm'
import moment from 'moment'
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import Button from "@material-ui/core/Button";
import { Link, useRouteMatch } from 'react-router-dom'
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
      {name === 'start_date' || name === 'end_date' ? moment(row[name]).format("HH:mm DD/MM/yyyy") : row[name]}
    </TableCell>
  );
};

const DeletedEvaluateList = () => {
  const dispatch = useDispatch()
  const classes = useStyles();
  let { url } = useRouteMatch();
  const [rows, setRows] = useState(null);

  const fetchDeletedStandard = () => {
    return axios.get('/admin/review/deleted')
      .then(res => {
        // console.log(res.data)
        setRows(res.data.reviews)
      })
      .catch(e => {
        console.log(e.response)
      })
  }
  useEffect(() => {
    fetchDeletedStandard()
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
    setStatusDelete({ open: true, onClick: () => restoreEvaluateWithAPI(id) })
  }
  // khôi phục đợt đánh giá vs api
  const restoreEvaluateWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/review/${ id }/restore`, {})
      .then(res => {
        const newRows = rows.filter(row => row.code !== id)
        setRows(newRows)
        dispatch(showSuccessSnackbar('Khôi phục đợt đánh giá thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Khôi phục đợt đánh giá thất bại'))
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
        Danh sách đợt đánh giá đã xoá
      </Typography >
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="caption table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#f4f4f4' }}>
              <TableCell className={classes.number} >Mã đợt đánh giá</TableCell>
              <TableCell className={classes.name} >Tên đợt đánh giá</TableCell>
              <TableCell style={{ width: '20%' }} >Mô tả</TableCell>
              <TableCell >Bắt đầu</TableCell>
              <TableCell >Kết thúc</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
              <TableRow key={row._id}>
                <CustomTableCell {...{ row, name: "code" }} />
                <CustomTableCell {...{ row, name: "name" }} />
                <CustomTableCell {...{ row, name: "description" }} />
                <CustomTableCell {...{ row, name: "start_date" }} />
                <CustomTableCell {...{ row, name: "end_date" }} />
                <TableCell align='right' className={classes.selectTableCell}>
                  <Tooltip title='Khôi phục'>
                    <IconButton
                      aria-label="restore"
                      onClick={() => onRestore(row.code)}
                      style={{ marginRight: '10px' }}
                    >
                      <RestoreFromTrashIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={6}>Không có đợt đánh giá</TableCell></TableRow>}
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
      <Link to={url.replace("/deleted", '')} component={Button} className={classes.btnback} variant="contained" style={{ float: 'right' }} ><KeyboardReturnIcon /></Link>
    </>
  )
}

export default DeletedEvaluateList
