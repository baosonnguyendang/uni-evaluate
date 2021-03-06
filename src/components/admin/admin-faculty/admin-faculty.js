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

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

import axios from 'axios'
import Skeleton from '../../common/Skeleton'
import Loading from '../../common/Loading'
import DialogConfirm from '../../common/DialogConfirm'
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'
import HelpIcon from '@material-ui/icons/Help';
import UnarchiveIcon from '@material-ui/icons/Unarchive';
import AssignmentReturnedIcon from '@material-ui/icons/AssignmentReturned';
import UpLoadFile from '../../common/UpLoadFile'
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
  // modal xo??
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => deleteDeptWithAPI(id) })
  }
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  // xo?? dept vs api
  const deleteDeptWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/department/${id}/delete`, {})
      .then(res => {
        const newRows = rows.filter(row => row.department_code !== id)
        setRows(newRows)
        dispatch(showSuccessSnackbar('Xo?? ????n v??? th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Xo?? ????n v??? th???t b???i'))
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
    setOpenImport(false)
    setModal({ open: true, id: '' });
  };
  //open modal
  const [modal, setModal] = React.useState({ open: false, id: '' });
  const handleClose = () => {
    setModal({ ...modal, open: false });
    setNewUnit('')
    setId('')
    setName('')
    setHeadUnit('')
    setValueRadio('default')
  };
  const onEdit = id => {
    rows.forEach(u => {
      if (u.department_code === id) {
        setId(id)
        setName(u.name)
        setHeadUnit(u.manager?.staff_id)
        setValueRadio(u.type)
      }
    })
    setModal({ open: true, id })
  }
  // edit submit dept
  const submitEditDept = (e, dept_code) => {
    e.preventDefault()
    const body = { new_dcode: id, name, type: valueRadio }
    setLoading(true)
    console.log(modal.id)
    setModal({ ...modal, open: false });

    axios.post(`/admin/department/${dept_code}/edit`, body)
      .then(res => {
        setRows(rows.map(r => r.department_code === dept_code ? { ...r, department_code: id, name, type: valueRadio } : r))
        dispatch(showSuccessSnackbar('C???p nh???t ????n v??? th??nh c??ng'))
        setLoading(false)
        handleClose()
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        setModal({ ...modal, open: true });
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('M?? ????n v??? ???? t???n t???i'))
            break;
          default:
            dispatch(showErrorSnackbar('C???p nh???t ????n v??? th???t b???i'))
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
    console.log(id, name, headUnit, newUnit, valueRadio);
    e.preventDefault()
    setLoading(true)
    const body = {
      department_code: id,
      name,
      manager: headUnit,
      parent: newUnit,
      type: valueRadio,
    }
    console.log(body)
    setModal({ ...modal, open: false });
    axios.post('/admin/department/addDepartment', body)
      .then(res => {
        console.log(res.data);
        setValueRadio('default')
        const temp = res.data.manager
        if (!newUnit) {
          if (temp === null) {
            setRows(rows => [...rows, { department_code: id, name, type: valueRadio }])
          }
          else {
            setRows(rows => [...rows, { department_code: id, name, idmanager: temp?.staff_id, namemanager: `${temp?.lastname} ${temp?.firstname}`, type: valueRadio }])
          }
        }

        dispatch(showSuccessSnackbar('T???o ????n v??? th??nh c??ng'))
        setLoading(false)
        handleClose();
      })
      .catch(err => {
        console.log(err)
        console.log(err.response)
        setModal({ ...modal, open: true });
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('M?? ????n v??? ???? t???n t???i'))
            break;
          case 404:
            dispatch(showErrorSnackbar('M?? tr?????ng ????n v??? kh??ng ????ng'))
            break;
          default:
            dispatch(showErrorSnackbar('T???o ????n v??? th???t b???i'))
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
  // open import
  const [openImport, setOpenImport] = useState(false)
  const handleOpenImport = () => {
    handleOpen()
    setOpenImport(true)
  }
  // submit file excel
  const submitExcel = (data) => {
    setLoading(true)
    const formData = new FormData()
    formData.append("file", data)
    console.log(formData)
    setLoading(true)
    handleClose()
    axios.post("/admin/user/file/import", formData)
      .then(res => {
        console.log(res.data);
        dispatch(showSuccessSnackbar('Import excel ng?????i d??ng th??nh c??ng'))
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        dispatch(showErrorSnackbar('Import excel ng?????i d??ng th???t b???i'))
        setLoading(false)
      })
  }

  // submit file excel
  const exportExcel = (data) => {
    setLoading(true)
    axios({
      url: `/admin/file/download?file=department`,
      method: 'GET',
      responseType: 'blob', // important
    })
      .then(async res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Department.xlsx`); //or any other extension
        document.body.appendChild(link);
        link.click();
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  //coi phai hddg ko
  const [valueRadio, setValueRadio] = React.useState('default');

  const handleChangeRadio = (event) => {
    console.log(event.target.value)
    setValueRadio(event.target.value);
  };

  return (
    <>
      {isLoading ? <Skeleton /> : (
        <div>
          <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
          <Loading open={loading} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography component="h1" variant="h5" color="inherit" noWrap>
              DANH S??CH ????N V???
            </Typography>
            <Tooltip title={
              <>
                <Typography variant='subtitle2'>Ch???n t??n ????n v??? ????? xem danh s??ch ng?????i d??ng v?? ????n v??? tr???c thu???c</Typography>
              </>
            }>
              <HelpIcon fontSize='small' color='action' />
            </Tooltip>
          </div>
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                  <TableCell align="left" style={{ width: '10%' }}>ID</TableCell>
                  <TableCell className={classes.name} align="left">T??n ????n v???</TableCell>
                  <TableCell className={classes.name} align="left">Tr?????ng ????n v???</TableCell>
                  <TableCell className={classes.name} align="left">ID Tr?????ng ????n v???</TableCell>
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
                        <Tooltip title='S????a'>
                          <IconButton
                            aria-label="delete"
                            onClick={() => onEdit(row.department_code)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Xo??a'>
                          <IconButton
                            aria-label="delete"
                            onClick={() => onDelete(row.department_code)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {rows.length === 0 && <TableRow><TableCell colSpan={5}>Kh??ng t???n t???i ????n v???</TableCell></TableRow>}
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
            <div style={{ margin: '10px', display: 'flex', alignItems: 'center' }}>
              <div style={{ flexGrow: 1 }}>
                <Button variant="contained" className={classes.btn} onClick={redirectStorePage}>
                  Kh??i ph???c
                </Button>
              </div>
              <Tooltip title={<Typography variant='subtitle2'>Xu???t excel m???u</Typography>}>
                <IconButton
                  onClick={exportExcel}
                >
                  <AssignmentReturnedIcon fontSize='large' />
                </IconButton>
              </Tooltip>
              &nbsp;
              <Tooltip title={<Typography variant='subtitle2'>Nh???p d??? li???u excel</Typography>}>
                <IconButton
                  onClick={handleOpenImport}
                >
                  <UnarchiveIcon fontSize='large' />
                </IconButton>
              </Tooltip>
              &nbsp;
              <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                Th??m ????n v???
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
                    {!openImport ?
                      <>
                        <Typography variant='h5' gutterBottom id="transition-modal-title">{modal.id ? 'C???p nh???t ????n v???' : "Th??m ????n v???"}</Typography>
                        <form onSubmit={modal.id ? (e) => submitEditDept(e, modal.id) : submitAddDepartment}>
                          <TextField onChange={e => setId(e.target.value)} id="id" label="M?? ????n v???" variant="outlined" fullWidth required margin='normal' defaultValue={id} />
                          <TextField onChange={e => setName(e.target.value)} id="name" label="T??n ????n v???" variant="outlined" fullWidth required margin='normal' defaultValue={name} />
                          {!modal.id && <TextField onChange={e => setHeadUnit(e.target.value)} id="headId" label="ID Tr?????ng ????n v???" fullWidth variant="outlined" margin='normal' defaultValue={headUnit} />}
                          {!modal.id &&
                            <FormControl variant="outlined" fullWidth margin='normal'>
                              <InputLabel htmlFor="outlined-newUnit-native">Thu???c ????n v???</InputLabel>
                              <Select
                                native
                                value={newUnit}
                                label='Thu???c ????n v???'
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
                          {
                            <FormControl style={{ display: 'contents' }}>
                              <FormLabel style={{ marginRight: 10, verticalAlign: 'middle' }}><span style={{color: 'black'}}>Loa??i ????n vi??:</span> </FormLabel>
                              <RadioGroup style={{ display: 'contents' }} row value={valueRadio} onChange={handleChangeRadio}>
                                <FormControlLabel value='default' control={<Radio />} label="M????c ??i??nh" />
                                <FormControlLabel value='council' control={<Radio />} label="H????i ??????ng" />
                              </RadioGroup>
                            </FormControl>
                          }
                          <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary">{modal.id ? "C???p nh???t" : 'T???o'}</Button>
                            <Button style={{ marginLeft: '10px' }} onClick={handleClose} variant="contained" color="primary">Tho??t</Button>
                          </div>
                        </form>
                      </> :
                      <UpLoadFile title={'Th??m danh sa??ch ????n v???'} handleClose={handleClose} submit={submitExcel} />}
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
