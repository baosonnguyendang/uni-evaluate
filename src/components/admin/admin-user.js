// import * as React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import { DataGrid } from '@material-ui/data-grid';
// import Button from '@material-ui/core/Button';
// import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     marginTop: '15px'
//   },
//   b: {
//     width: '80px',
//     margin: '10px',
//     textAlign: 'end',
//   },
//   input: {
//     display: 'none',
//   }
// }));

// const columns = [
//   { field: 'id', headerName: 'ID', width: 70 },
//   { field: 'firstName', headerName: 'Tên', width: 100 },
//   { field: 'lastName', headerName: 'Họ và tên đệm', width: 180 },
//   {
//     field: 'dob',
//     headerName: 'DOB',
//     width: 90,
//   },
//   {
//     field: 'user',
//     headerName: 'Tên đăng nhập',
//     width: 180,
//   },
//   {
//     field: 'password',
//     headerName: 'Mật khẩu',
//     sortable: false,
//     width: 180,
//   },
//   {
//     field: 'role',
//     headerName: 'Chức vụ',
//     width: 120,
//   },
//   {
//     field: 'faculty',
//     headerName: 'Khoa/Phòng/Ban',
//     width: 180,
//   },
// ];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', dob: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', dob: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', dob: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', dob: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', dob: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, dob: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', dob: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', dob: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', dob: 65 },
// ];

// export default function BasicTable() {
//   const classes = useStyles();

//   return (
//     <div>
//       <Typography component="h1" variant="h5" color="inherit" noWrap>
//         DANH SÁCH NGƯỜI DÙNG
//       </Typography>
//       <Paper className={classes.paper}>
//         <div>
//           <div style={{ textAlign: "right", paddingTop: '5px' }}>
//             <input
//               accept="image/*"
//               className={classes.input}
//               id="contained-button-file"
//               multiple
//               type="file"
//             />
//             <label htmlFor="contained-button-file">
//               <Button variant="contained" color="primary" component="span" className={classes.b}>
//                 Thêm
//               </Button>
//             </label>
//             <Button className={classes.b} variant="contained">Xóa</Button>
//             <Button className={classes.b} variant="contained">Sửa</Button>
//           </div>
//           <div style={{ height: 400, width: '100%', padding: '5px 10px 10px 10px' }}>
//             <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
//           </div>
//         </div>
//       </Paper>
//     </div>
//   );
// }
import React from "react";
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
    height: 30,
  },
  input: {
    height: 30
  },
  name: {
    width: '30%',
    height: 30,
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

const createData = (id, lname, fname, email, unit, role) => ({
  id, lname, fname, email, unit, role, isEditMode: false
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
    createData("1712970", 'Szoboszlai', 'Dominik', 'a@b.com', 'Máy tính', 'NV'),
    createData("1234567", 'Mai Thanh', 'Phong', 'aa@b.com', 'BGH', 'Hiệu trưởng'),
    createData("1234568", 'Bùi Hoài', 'Thắng', 'aaa@b.com', 'Phòng đào tạo', 'Trưởng'),
  ]);
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
  const [lname, setName] = React.useState('')
  const [fname, setC] = React.useState('')
  const [email, setD] = React.useState('')
  const [unit, setN] = React.useState(0)
  const [role, setP] = React.useState(0)
  const submit = e => {
    e.preventDefault()
    setRows(rows => [...rows, createData(id, lname, fname, email, unit, role)])
  }

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        DANH SÁCH NGƯỜI DÙNG
      </Typography>
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="caption table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#f4f4f4' }}>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Họ và tên đệm</TableCell>
              <TableCell align="left">Tên</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Đơn vị</TableCell>
              <TableCell align="left">Chức vụ</TableCell>
              <TableCell align="left" />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow key={row.id}>
                  <CustomTableCell className={classes.name} {...{ row, name: "id", onChange }} />
                  <CustomTableCell className={classes.name} {...{ row, name: "lname", onChange }} />
                  <CustomTableCell {...{ row, name: "fname", onChange }} />
                  <CustomTableCell className={classes.name} {...{ row, name: "email", onChange }} />
                  <CustomTableCell className={classes.name} {...{ row, name: "unit", onChange }} />
                  <CustomTableCell className={classes.name} {...{ row, name: "role", onChange }} />
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
              Thêm người dùng
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
                <h2 id="transition-modal-title">Thêm người dùng</h2>
                <form onSubmit={submit}>
                  <TextField onChange={e => setId(e.target.value)} id="id" label="ID" variant="outlined" fullWidth className={classes.field} />
                  <TextField onChange={e => setName(e.target.value)} id="lname" label="Họ và tên đệm" variant="outlined" fullWidth className={classes.field} />
                  <TextField onChange={e => setC(e.target.value)} id="fname" label="Tên" variant="outlined" fullWidth className={classes.field} />
                  <TextField onChange={e => setD(e.target.value)} id="email" label="Email" multiline variant="outlined" className={classes.field} />
                  <TextField onChange={e => setN(e.target.value)} id="unit" type='number' label="Đơn vị" variant="outlined" fullWidth className={classes.field} />
                  <TextField onChange={e => setP(e.target.value)} id="role" type='number' label="Chức vụ" variant="outlined" fullWidth className={classes.field} />
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
