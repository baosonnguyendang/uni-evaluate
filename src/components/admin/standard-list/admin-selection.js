import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { useParams } from 'react-router-dom';

import { makeStyles } from "@material-ui/core/styles";
import Link from '@material-ui/core/Link'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
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
import axios from "axios";

//token
const token = localStorage.getItem('token');
const config = { headers: { "Authorization": `Bearer ${token}` } };


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
  field: {
    marginBottom: 10,
  }
}));

const createData = (name, code, description, point) => ({
  id: code,
  name,
  code,
  description,
  point,
  isEditMode: false
});

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
        row[name]
      )}
    </TableCell>
  );
};

// component={Link} href={window.location.href + '/a'}

export default function Selection() {
  const [rows, setRows] = React.useState([
    // createData("Định mức giờ chuẩn hoàn thành", '00101', 'BÙm bùm bùm bùm', 5),
    // createData("Kết quả khảo sát chất lượng dịch vụ", '00102', 'Mô tảaaaaaaaaaaaaaaaaaaaaaa', 7),
    // createData("Hình thức giảng dạy khác", '00103', 'Description', 10)
  ]);
  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();
  const { id } = useParams();

  const fetchSelection = () => {
    axios.get(`/admin/criteria/${id}/option`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        const selections = res.data.criteriaOptions;
        setRows(selections.map(op=>createData(op.code, op.name, op.description, op.max_point)))
        setPrevious([...rows])
        // setIsLoading(false)
      })
  }
  useEffect(() => {
    fetchSelection()
  }, [])

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
    let { id } = row;
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

  //open modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Tạo lựa chọn
  const submitAddSelection = (e) =>{
    console.log(code, name, description, point);
    const body = {
      code,
      name,
      max_point: point,
      description
    }
    axios.post(`/admin/criteria/${id}/addCriteriaOption`, body, config)
    .then(res=>{
      console.log(res.data);
      e.preventDefault()
      setRows(rows => [...rows, createData(code, name, description, point)])
      handleClose();
    })
    .catch(e=>{
      console.error(e);
    })
  }

  //get data from new criterion
  const [name, setName] = React.useState('')
  const [code, setC] = React.useState('')
  const [description, setD] = React.useState('')
  const [point, setP] = React.useState(0)
  const submit = e => {
    e.preventDefault()
    setRows(rows => [...rows, createData(code, name, description, point)])
  }

  function User() {
    let { id } = useParams();
    return (
      < Typography component="h1" variant="h5" color="inherit" noWrap >
        Tiêu chí { id} - DS lựa chọn
      </Typography >
    )
  }

  return (
    <div>
      <User />
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="caption table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#f4f4f4' }}>
              <TableCell className={classes.number} >Mã </TableCell>
              <TableCell className={classes.name} >Lựa chọn </TableCell>
              <TableCell >Mô tả</TableCell>
              <TableCell >Điểm</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <CustomTableCell className={classes.name} {...{ row, name: "name", onChange }} />
                <CustomTableCell className={classes.number} {...{ row, name: "code", onChange }} />
                <CustomTableCell {...{ row, name: "description", onChange }} />
                <CustomTableCell {...{ row, name: "point", onChange }} />
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
            ))}
          </TableBody>
        </Table>
        <div style={{ margin: '10px', textAlign: 'right' }}>
          <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
            Thêm lựa chọn
          </Button>
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
                <h2 id="transition-modal-title">Thêm lựa chọn</h2>
                <form onSubmit={submitAddSelection}>
                  <TextField onChange={e => setC(e.target.value)} id="code" label="Mã" variant="outlined" fullWidth className={classes.field} />
                  <TextField onChange={e => setName(e.target.value)} id="name" label="Tên" variant="outlined" fullWidth className={classes.field} />
                  <TextField onChange={e => setD(e.target.value)} id="description" label="Mô tả" multiline variant="outlined" className={classes.field} />
                  <TextField onChange={e => setP(e.target.value)} id="point" label="Điểm" type="number" variant="outlined" className={classes.field} />
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" onClick={submitAddSelection}>Tạo</Button>
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
