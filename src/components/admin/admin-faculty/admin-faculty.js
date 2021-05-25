import React, { useState, useEffect } from "react";
import  { Link, useRouteMatch } from "react-router-dom";
import ButtonCustom from '../../common/ButtonCustom'
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
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
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import axios from 'axios'
import Skeleton from '../../common/skeleton'

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
    width: '20%',
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

const createData = (id, name, head, headId, under) => ({
  id, name, head, headId, under, isEditMode: false
})

const CustomTableCell = ({ row, name, onChange, ...rest }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="left" className={classes.tableCell} {...rest}>
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={e => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        (row[name])
      )}
    </TableCell>
  );
};

export default function Criterion() {
  let { url } = useRouteMatch();
  const [rows, setRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true)
  const token = localStorage.getItem('token')
  const [previous, setPrevious] = React.useState([]);
  const fetchDepartment = () => {
    axios.get('/admin/department/parent', { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data.parents);
        setRows(res.data.parents.map(dep => ({ ...dep, namemanager: (dep?.manager && `${dep.manager.lastname} ${dep?.manager?.firstname}`), idmanager: dep?.manager?.staff_id, parent: dep?.parent?.name, isEditMode: false })))
        setPrevious([...rows])
        setIsLoading(false)
      })
  }
  useEffect(() => {
    fetchDepartment()
  }, [])
  const classes = useStyles();

  const onToggleEditMode = id => {
    setPrevious([...rows])
    console.log(rows)
    setRows(state => {
      return rows.map(row => {
        if (row._id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onChange = (e, row) => {
    const value = e.target.value;
    const name = e.target.name;
    const { _id } = row;
    const newRows = rows.map(row => {
      if (row._id === _id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const onDelete = id => {
    const newRows = rows.filter(row => row._id !== id)
    setRows(newRows)
  }

  const onRevert = id => {
    setRows([...previous])
  };

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
  const [open, setOpen] = React.useState(false);
  const [units, setUnits] = React.useState([])
  const handleOpen = () => {
    axios.get('admin/department/parent', { headers: { "Authorization": `Bearer ${token}` } })
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
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //
  const [loadingButton, setLoadingButton] = useState(false)

  //get data from new criterion
  const [id, setId] = React.useState('')
  const [name, setName] = React.useState('')
  const [head, setHead] = React.useState('')

  const submitAddDepartment = (e) => {
    console.log(id, name, head, newUnit);
    e.preventDefault()
    setLoadingButton(true)
    const body = {
      department_code: id,
      name,
      manager: head,
      parent: newUnit
    }
    console.log(body)
    axios.post('/admin/department/addDepartment', body, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        //console.log(res.data);

        setRows(rows => [...rows, createData(id, name, null, head, newUnit)])
        setLoadingButton(false)
        handleClose();
      })
      .catch(error => {
        console.log(error);
        setLoadingButton(false)
      })
  }

  const submit = e => {
    e.preventDefault()
    setRows(rows => [...rows, createData(id, name, null, head, newUnit)])
  }

  //chon don vi cha khi them don vi moi
  const [newUnit, setNewUnit] = React.useState('');
  const handleChangeUnit = (event) => {
    setNewUnit(event.target.value);
  };
  
  return (
    <>
      { isLoading ? <Skeleton /> : (
        <div>
          <Typography component="h1" variant="h5" color="inherit" noWrap>
            DANH SÁCH ĐƠN VỊ
          </Typography>
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                  <TableCell align="left">ID</TableCell>
                  <TableCell className={classes.name} align="left">Tên đơn vị</TableCell>
                  <TableCell className={classes.name} align="left">Trưởng đơn vị</TableCell>
                  <TableCell className={classes.name} align="left">ID Trưởng đơn vị</TableCell>
                  <TableCell className={classes.name} align="left">Trực thuộc</TableCell>
                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow key={row._id}>
                      <CustomTableCell className={classes.number} {...{ row, name: "department_code", onChange }} />
                      <CustomTableCell className={classes.name} {...{ row, name: "name", onChange }} component = {Link} to={`${url}/${row.department_code}`}/>
                      <CustomTableCell className={classes.name} {...{ row, name: "namemanager", onChange }} />
                      <CustomTableCell className={classes.name} {...{ row, name: "idmanager", onChange }} />
                      <CustomTableCell className={classes.name} {...{ row, name: "parent", onChange }} />
                      <TableCell className={classes.selectTableCell}>
                        {row.isEditMode ? (
                          <>
                            <IconButton
                              aria-label="done"
                              onClick={() => onToggleEditMode(row._id)}
                            >
                              <DoneIcon />
                            </IconButton>
                            <IconButton
                              aria-label="revert"
                              onClick={() => onRevert(row._id)}
                            >
                              <RevertIcon />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              aria-label="delete"
                              onClick={() => onToggleEditMode(row._id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={() => onDelete(row._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
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
            <div style={{ margin: '10px', textAlign: 'right' }}>
              <div>
                <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                  Thêm đơn vị
                </Button>
                <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                  import file
                </Button>
              </div>
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
                  <Typography variant='h4' gutterBottom id="transition-modal-title">Thêm đơn vị</Typography>
                    <form onSubmit={submitAddDepartment}>
                      <TextField onChange={e => setId(e.target.value)} id="id" label="ID" variant="outlined" fullWidth required className={classes.field} />
                      <TextField onChange={e => setName(e.target.value)} id="fname" label="Tên" variant="outlined" fullWidth required className={classes.field} />
                      <TextField onChange={e => setHead(e.target.value)} id="headId" label="ID Trưởng đơn vị" fullWidth variant="outlined" className={classes.field} />
                      {/* <TextField onChange={e => setN(e.target.value)} id="unit" label="Đơn vị" variant="outlined" fullWidth className={classes.field} /> */}
                      <FormControl variant="outlined" fullWidth className={classes.field}>
                        <InputLabel htmlFor="outlined-newUnit-native">Đơn vị</InputLabel>
                        <Select
                          native
                          value={newUnit}
                          label='Đơn vị'
                          onChange={handleChangeUnit}
                        >
                          <option aria-label="None" value="" />
                          {units.map(unit => {
                            return (
                              <option key={unit._id} value={unit.department_code}>{unit.name}</option>
                            )
                          })}
                        </Select>
                      </FormControl>
                      <div style={{ justifyContent: 'center', marginTop: '10px', display: "flex" }}>
                        <ButtonCustom loading={loadingButton} type="submit" variant="contained" color="primary">Tạo</ButtonCustom>
                        <ButtonCustom onClick={handleClose} variant="contained" color="primary">Thoát</ButtonCustom>
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
