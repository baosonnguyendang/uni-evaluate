import React, {useEffect} from "react";
import ReactDOM from "react-dom";

import { Link } from 'react-router-dom';

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

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="left" className={classes.tableCell}>
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
  const [rows, setRows] = React.useState([
    createData("1", 'BGH', 'Mai Thanh Phong', '1234567', null),
    createData("2", 'Phòng đào tạo', 'Bùi Hoài Thắng', '1234568', null),
    createData("3", 'Máy tính', 'idk', '0', null),
  ]);
  const token = localStorage.getItem('token')
  const fetchDepartment = () => {
    axios.get('/admin/department', { headers: {"Authorization" : `Bearer ${token}`} })
          .then(res => {
              console.log(res.data.departments);
             setRows(res.data.departments.map(dep => ({...dep,namemanager:(dep?.manager && `${dep.manager.lastname} ${dep?.manager?.firstname}`),idmanager:dep?.manager?.staff_id,parent:dep?.parent?.name})))
              // setIsLoading(false)
  })}
  useEffect(() => {
    fetchDepartment()
  }, [])
  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();

  const onToggleEditMode = id => {
    setRows(state => {
      return rows.map(row => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious(state => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const onDelete = id => {
    const newRows = rows.filter(row => row.id !== id)
    setRows(newRows)
  }

  const onRevert = id => {
    const newRows = rows.map(row => {
      if (row.id === id) {
        return previous[id] ? previous[id] : row;
      }
      return row;
    });
    setRows(newRows);
    setPrevious(state => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
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

  //open modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //get data from new criterion
  const [id, setId] = React.useState('')
  const [name, setName] = React.useState('')
  const [head, setC] = React.useState('')
  const [headId, setD] = React.useState('')
  const [under, setN] = React.useState(0)
  const submit = e => {
    e.preventDefault()
    setRows(rows => [...rows, createData(id, name, head, headId, under)])
  }

  return (
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
                <TableRow key={row.id}>
                  <CustomTableCell className={classes.number} {...{ row, name: "department_code", onChange }} />
                  <CustomTableCell className={classes.name} {...{ row, name: "name", onChange }} />
                  <CustomTableCell className={classes.name} {...{ row, name: "namemanager", onChange }} />
                  <CustomTableCell className={classes.name} {...{ row, name: "idmanager", onChange }} />
                  <CustomTableCell className={classes.name} {...{ row, name: "parent", onChange }} />
                  <TableCell className={classes.selectTableCell}>
                    {row.isEditMode ? (
                      <>
                        <IconButton
                          aria-label="done"
                          onClick={() => onToggleEditMode(row.id)}
                        >
                          <DoneIcon />
                        </IconButton>
                        <IconButton
                          aria-label="revert"
                          onClick={() => onRevert(row.id)}
                        >
                          <RevertIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          aria-label="delete"
                          onClick={() => onToggleEditMode(row.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => onDelete(row.id)}
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
                <h2 id="transition-modal-title">Thêm đơn vị</h2>
                <form onSubmit={submit}>
                  <TextField onChange={e => setId(e.target.value)} id="id" label="ID" variant="outlined" fullWidth className={classes.field} />
                  <TextField onChange={e => setC(e.target.value)} id="fname" label="Tên" variant="outlined" fullWidth className={classes.field} />
                  <TextField onChange={e => setD(e.target.value)} id="email" label="ID Trưởng đơn vị" multiline variant="outlined" className={classes.field} />
                  <TextField onChange={e => setN(e.target.value)} id="unit" type='number' label="Đơn vị" variant="outlined" fullWidth className={classes.field} />
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >Tạo</Button>
                    <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Thoát</Button>
                  </div>
                </form>
              </div>
            </Fade>
          </Modal>
        </div>
      </Paper>
    </div>
  );
}
