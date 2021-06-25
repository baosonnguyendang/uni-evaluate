import React, { useState, useEffect } from "react";
import { Link, useRouteMatch, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from "@material-ui/core/TableRow";

import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
// Icons
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import EditIcon from "@material-ui/icons/EditOutlined";

import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import axios from 'axios'
import Skeleton from '../../common/Skeleton'
import Loading from '../../common/Loading'
import DialogConfirm from '../../common/DialogConfirm'
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'
import HelpIcon from '@material-ui/icons/Help';

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
    display: 'flex',
    justifyContent: 'flex-end',
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
    width: '10%'
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
  btn: {
    marginRight: 5,
    minWidth: 180,
  },
  field: {
    marginBottom: 10,
  }
}));

export default function Criterion() {
  const dispatch = useDispatch()
  let { url } = useRouteMatch();
  const [rows, setRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true)
  const fetchDepartment = () => {
    axios.get('/admin/department/parent')
      .then(res => {
        console.log(res.data.parents);
        setRows(res.data.parents.map(dep => ({ ...dep, namemanager: (dep?.manager && `${dep.manager.lastname} ${dep?.manager?.firstname}`), idmanager: dep?.manager?.staff_id, parent: dep?.parent?.name, isEditMode: false })))
        setIsLoading(false)
      })
  }
  useEffect(() => {
    fetchDepartment()
  }, [])
  const classes = useStyles();

  const CustomTableCell = ({ row, name, ...rest }) => {
    return (
      <TableCell align="left" className={classes.tableCell} {...rest}>
        {name === 'name' ? (<Link to={`${url}/${row.department_code}`} style={{ color: 'black' }}>{row[name]}</Link>) : (row[name])}
      </TableCell>
    );
  };
  // modal xoá
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => deleteDeptWithAPI(id) })
  }
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  // xoá dept vs api
  const deleteDeptWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/department/${id}/delete`, {})
      .then(res => {
        const newRows = rows.filter(row => row.department_code !== id)
        setRows(newRows)
        dispatch(showSuccessSnackbar('Xoá đơn vị thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Xoá đơn vị thất bại'))
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

  //open modal, khi nay lay ds don vi cha tu be luon
  const [units, setUnits] = React.useState([])
  const handleOpen = () => {
    axios.get('admin/department/parent')
      .then(res => {
        console.log(res.data.parents)
        setUnits(res.data.parents)
        // setNewUnit(res.data.parents)
        // res.data.parents.map(x => {
        //   setUnits(units => [...units, createData(x.name, x.department_code)])
        // })

      })
      .catch(e => {
        console.log(e)
      })
    setModal({ open: true, id: '' });
  };
  //open modal
  const [modal, setModal] = React.useState({ open: false, id: '' });
  const handleClose = () => {
    setModal({ ...modal, open: false });
    setNewUnit('')
  };
  const onEdit = id => {
    rows.forEach(u => {
      if (u.department_code === id) {
        setId(id)
        setName(u.name)
        setHeadUnit(u.manager?.staff_id)
      }
    })
    setModal({ open: true, id })
  }
  // edit submit dept
  const submitEditDept = (e, id) => {
    e.preventDefault()
    const body = { new_dcode: id, name }
    setLoading(true)
    console.log(modal.id)

    handleClose()
    axios.post(`/admin/department/${id}/edit`, body)
      .then(res => {
        setRows(rows.map(r => r.department_code === id ? { ...r, department_code: id, name } : r))
        dispatch(showSuccessSnackbar('Cập nhật đơn vị thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('Mã đơn vị đã tồn tại'))
            break;
          default:
            dispatch(showErrorSnackbar('Cập nhật đơn vị thất bại'))
            break;
        }
        setLoading(false)
      })
  }

  // loading add unit
  const [loading, setLoading] = useState(false)

  //data dept
  const [id, setId] = React.useState('')
  const [name, setName] = React.useState('')
  const [headUnit, setHeadUnit] = React.useState('')

  const submitAddDepartment = (e) => {
    console.log(id, name, headUnit, newUnit);
    e.preventDefault()
    setLoading(true)
    const body = {
      department_code: id,
      name,
      manager: headUnit,
      parent: newUnit
    }
    console.log(body)
    handleClose();
    axios.post('/admin/department/addDepartment', body)
      .then(res => {
        //console.log(res.data);
        dispatch(showSuccessSnackbar('Tạo đơn vị thành công'))
        setRows(rows => [...rows, { department_code: id, name, manager: headUnit, parent: newUnit }])
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('Mã đơn vị đã tồn tại'))
            break;
          case 404:
            dispatch(showErrorSnackbar('Mã trưởng đơn vị không đúng'))
            break;
          default:
            dispatch(showErrorSnackbar('Tạo đơn vị thất bại'))
            break;
        }
        setLoading(false)
      })
  }

  //chon don vi cha khi them don vi moi
  const [newUnit, setNewUnit] = React.useState('');
  const handleChangeUnit = (event) => {
    setNewUnit(event.target.value);
  };
  let history = useHistory();

  const redirectStorePage = () => {
    history.push(`${url}/deleted`)
  }
  return (
    <>
      {isLoading ? <Skeleton /> : (
        <div>
          <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
          <Loading open={loading} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography component="h1" variant="h5" color="inherit" noWrap>
              DANH SÁCH ĐƠN VỊ
            </Typography>
            <Tooltip title={
              <>
                <Typography variant='subtitle2'>Chọn tên đơn vị để xem danh sách người dùng và đơn vị trực thuộc</Typography>
              </>
            }>
                <HelpIcon fontSize='small' color='action'/>
            </Tooltip>
          </div>
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                  <TableCell align="left">ID</TableCell>
                  <TableCell className={classes.name} align="left">Tên đơn vị</TableCell>
                  <TableCell className={classes.name} align="left">Trưởng đơn vị</TableCell>
                  <TableCell className={classes.name} align="left">ID Trưởng đơn vị</TableCell>
                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow key={row.department_code}>
                      <CustomTableCell {...{ row, name: "department_code" }} />
                      <CustomTableCell {...{ row, name: "name" }} />
                      <CustomTableCell {...{ row, name: "namemanager" }} />
                      <CustomTableCell {...{ row, name: "idmanager" }} />
                      <TableCell className={classes.selectTableCell}>
                        <IconButton
                          aria-label="delete"
                          onClick={() => onEdit(row.department_code)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => onDelete(row.department_code)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {rows.length === 0 && <TableRow><TableCell colSpan={5}>Không tồn tại đơn vị</TableCell></TableRow>}
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
            <div style={{ margin: '10px', display: 'flex' }}>
              <div style={{ flexGrow: 1 }}>
                <Button variant="contained" className={classes.btn} onClick={redirectStorePage}>
                  Khôi phục
                </Button>
              </div>
              <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                Thêm đơn vị
              </Button>
              <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                import file
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
                    <Typography variant='h5' gutterBottom id="transition-modal-title">{modal.id ? 'Cập nhật đơn vị' : "Thêm đơn vị"}</Typography>
                    <form onSubmit={modal.id ? (e) => submitEditDept(e, modal.id) : submitAddDepartment}>
                      <TextField onChange={e => setId(e.target.value)} id="id" label="ID" variant="outlined" fullWidth required margin='normal' defaultValue={modal.id && id} />
                      <TextField onChange={e => setName(e.target.value)} id="name" label="Tên" variant="outlined" fullWidth required margin='normal' defaultValue={modal.id && name} />
                      {!modal.id && <TextField onChange={e => setHeadUnit(e.target.value)} id="headId" label="ID Trưởng đơn vị" fullWidth variant="outlined" margin='normal' />}
                      {!modal.id &&
                        <FormControl variant="outlined" fullWidth margin='normal'>
                          <InputLabel htmlFor="outlined-newUnit-native">Thuộc đơn vị</InputLabel>
                          <Select
                            native
                            value={newUnit}
                            label='Thuộc đơn vị'
                            onChange={handleChangeUnit}
                          >
                            <option aria-label="None" value="" />
                            {units.map(unit => {
                              return (
                                <option key={unit._id} value={unit.department_code}>{unit.name}</option>
                              )
                            })}
                          </Select>
                        </FormControl>}
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary">{modal.id ? "Cập nhật" : 'Tạo'}</Button>
                        <Button style={{ marginLeft: '10px' }} onClick={handleClose} variant="contained" color="primary">Thoát</Button>
                      </div>
                    </form>
                  </div>
                </Fade>
              </Modal>
            </div>
          </Paper>
        </div>
      )}
    </>

  );
}
