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
import { useParams } from 'react-router-dom'
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

const DeletedSelection = () => {
  const dispatch = useDispatch()
  const classes = useStyles();
  const [rows, setRows] = useState(null);
  const { id1 } = useParams()
  const { url } = useRouteMatch()
  // t??n ti??u chu???n
  const [nameCriteria, setNameCriteria] = useState(null)
  // console.log(id1)
  const fetchDeletedSelectionaOfCriteria = (id) => {
    return axios.get(`/admin/criteria/${ id }/option/deleted`)
      .then(res => {
        // console.log(res.data)
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
  // modal xo??
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  const onRestore = id => {
    setStatusDelete({ open: true, onClick: () => restoreSelectionWithAPI(id) })
  }
  // kh??i ph???c l???a ch???n. vs api
  const restoreSelectionWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/criteria/option/${ id }/restore`, {})
      .then(res => {
        const newRows = rows.filter(row => row.code !== id)
        setRows(newRows)
        dispatch(showSuccessSnackbar('Kh??i ph???c l???a ch???n th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Kh??i ph???c l???a ch???n th???t b???i'))
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
      <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} text='B???n mu???n kh??i ph???c ?' />
      <Loading open={loading} />
      <Typography component="h1" variant="h5" color="inherit" noWrap >
        Ti??u ch?? {nameCriteria} - Danh s??ch l???a ch???n ???? xo??
      </Typography >
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="caption table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#f4f4f4' }}>
              <TableCell className={classes.number} >M?? l???a ch???n</TableCell>
              <TableCell className={classes.name} >T??n l???a ch???n</TableCell>
              <TableCell className={classes.description}>M?? t???</TableCell>
              <TableCell >??i???m<meta http-equiv="X-UA-Compatible" content="IE=7" /></TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
              <TableRow key={row._id}>
                <CustomTableCell {...{ row, name: "code" }} />
                <CustomTableCell {...{ row, name: "name" }} />
                <CustomTableCell {...{ row, name: "description" }} />
                <CustomTableCell {...{ row, name: "max_point" }} />
                <TableCell align='right' className={classes.selectTableCell}>
                  <Tooltip title='Kh??i phu??c'>
                    <IconButton
                      aria-label="restore"
                      onClick={() => onRestore(row.code)}
                    >
                      <RestoreFromTrashIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={5}>Kh??ng c?? l???a ch???n</TableCell></TableRow>}
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

export default DeletedSelection
