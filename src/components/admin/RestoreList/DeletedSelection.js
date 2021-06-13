import React, { useState, useEffect } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
// Icons
import Typography from '@material-ui/core/Typography';

import Loading from '../../common/Loading'
import Skeleton from '../../common/Skeleton'
import DialogConfirm from '../../common/DialogConfirm'
import { useParams } from 'react-router-dom'
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'

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
    width: '100%'
  },
  btn: {
    marginRight: 5,
    minWidth: 180,
  },
}));

const CustomTableCell = ({ row, name }) => {
  const classes = useStyles();

  return (
    <TableCell align="left" className={classes.tableCell}>
      {row[name]}
    </TableCell>
  );
};

const DeletedSelection = () => {
  const dispatch = useDispatch()
  const classes = useStyles();
  const [rows, setRows] = useState(null);
  const token = localStorage.getItem('token')
  const config = { headers: { "Authorization": `Bearer ${token}` } }
  const { id1 } = useParams()
  // tên tiêu chuẩn
  const [nameCriteria, setNameCriteria] = useState(null)
  console.log(id1)
  const fetchDeletedSelectionaOfCriteria = (id) => {
    return axios.get(`/admin/criteria/${id}/option/deleted`, config)
      .then(res => {
        console.log(res.data)
        setRows(res.data.criteriaOptions)
        setNameCriteria(res.data.criteria.name)
      })
      .catch(e => {
        console.log(e.response)
      })
  }
  useEffect(() => {
    fetchDeletedSelectionaOfCriteria(id1)
  }, [])

  // loading restore criteria
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ open: false, time: 3000, message: '', severity: '' })
  const handleCloseToast = () => setToast({ ...toast, open: false })
  // modal xoá
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  const onRestore = id => {
    setStatusDelete({ open: true, onClick: () => restoreSelectionWithAPI(id) })
  }
  // khôi phục lựa chọn. vs api
  const restoreSelectionWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/criteria/option/${id}/restore`, {}, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        const newRows = rows.filter(row => row.code !== id)
        setRows(newRows)
        dispatch(showSuccessSnackbar('Khôi phục lựa chọn thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Khôi phục lựa chọn thất bại'))
        setLoading(false)
      })
  }
  if (!rows)
    return <Skeleton />
  return (
    <>
      <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} text='Bạn muốn khôi phục ?' />
      <Loading open={loading} />
      <Typography component="h1" variant="h5" color="inherit" noWrap >
        Tiêu chí {nameCriteria} - Danh sách lựa chọn đã xoá
      </Typography >
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="caption table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#f4f4f4' }}>
              <TableCell className={classes.number} >Mã lựa chọn</TableCell>
              <TableCell className={classes.name} >Tên lựa chọn</TableCell>
              <TableCell className={classes.description}>Mô tả</TableCell>
              <TableCell >Kiểu đánh giá</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row._id}>
                <CustomTableCell {...{ row, name: "code" }} />
                <CustomTableCell {...{ row, name: "name" }} />
                <CustomTableCell {...{ row, name: "description" }} />
                <CustomTableCell {...{ row, name: "type" }} />
                <TableCell align='right' className={classes.selectTableCell}>
                  <IconButton
                    aria-label="restore"
                    onClick={() => onRestore(row.code)}
                  >
                    <RestoreFromTrashIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={5}>Không có lựa chọn</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>
    </>
  )
}

export default DeletedSelection
