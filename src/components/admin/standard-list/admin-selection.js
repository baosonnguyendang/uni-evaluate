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
    width: '40%',
    height: 40,
  },
  number: {
    width: '10%'
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
  const [rows, setRows] = React.useState(null);
  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();
  const { id } = useParams();
  //token
  const token = localStorage.getItem('token');
  const config = { headers: { "Authorization": `Bearer ${token}` } };

  const fetchSelection = () => {
    axios.get(`/admin/criteria/${id}/option`, config)
      .then(res => {
        const selections = res.data.criteriaOptions;
        console.log(selections)
        setRows(res.data.criteriaOptions)
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

  //open modal
  const [modal, setModal] = React.useState({ open: false, id: '' });
  const handleOpen = () => {
    setModal({ open: true, id: '' });
  };
  const handleClose = () => {
    setModal({ ...modal, open: false });
  };
  const onEdit = id => {
    rows.forEach(u => {
      if (u.code === id) {
        setCode(id)
        setName(u.name)
        setDescription(u.description)
        setPoint(u.max_point)
      }
    })
    setModal({ open: true, id })
  }

  // Tạo lựa chọn
  const submitAddSelection = (e) => {
    console.log(code, name, description, point);
    const body = {
      code,
      name,
      max_point: point,
      description
    }
    axios.post(`/admin/criteria/${id}/addCriteriaOption`, body, config)
      .then(res => {
        console.log(res.data);
        e.preventDefault()
        setRows(rows => [...rows, createData(code, name, description, point)])
        handleClose();
      })
      .catch(e => {
        console.error(e);
      })
  }

  //get data from new criterion
  const [name, setName] = React.useState('')
  const [code, setCode] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [point, setPoint] = React.useState(0)
  const submit = e => {
    e.preventDefault()
    setRows(rows => [...rows, createData(code, name, description, point)])
  }

  function Criteria() {
    let { id } = useParams();
    return (
      < Typography component="h1" variant="h5" color="inherit" noWrap >
        Tiêu chí { id} - DS lựa chọn
      </Typography >
    )
  }

  return (
    <>
      {!rows ? <Skeleton /> :
        <div>
          <Criteria />
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                  <TableCell className={classes.number} >Mã </TableCell>
                  <TableCell className={classes.name} >Lựa chọn </TableCell>
                  <TableCell className={classes.description}>Mô tả</TableCell>
                  <TableCell >Điểm</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id}>
                    <CustomTableCell className={classes.name} {...{ row, name: "code", onChange }} />
                    <CustomTableCell className={classes.number} {...{ row, name: "name", onChange }} />
                    <CustomTableCell {...{ row, name: "description", onChange }} />
                    <CustomTableCell {...{ row, name: "max_point", onChange }} />
                    <TableCell className={classes.selectTableCell}>
                      <IconButton
                        aria-label="delete"
                        onClick={() => onEdit(row.code)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => onDelete(row.code)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {rows.length === 0 && <Typography variant='body1' >Không có tiêu chí</Typography>}
            <div style={{ margin: '10px', textAlign: 'right' }}>
              <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                Thêm lựa chọn
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
                    <Typography variant='h5' gutterBottom id="transition-modal-title">{modal.id ? "Cập nhật lựa chọn" : 'Thêm lựa chọn'}</Typography>
                    <form onSubmit={submitAddSelection}>
                      <TextField onChange={e => setCode(e.target.value)} id="code" label="Mã" variant="outlined" fullWidth autoFocus required className={classes.field} defaultValue={modal.id && code} />
                      <TextField onChange={e => setName(e.target.value)} id="name" label="Tên" variant="outlined" fullWidth required className={classes.field} defaultValue={modal.id && name} />
                      <TextField onChange={e => setDescription(e.target.value)} id="description" label="Mô tả" multiline fullWidth variant="outlined" className={classes.field} defaultValue={modal.id && description} />
                      <TextField onChange={e => setPoint(e.target.value)} id="point" label="Điểm" type="number" fullWidth required variant="outlined" className={classes.field} defaultValue={modal.id && point} />
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Button style={{ marginRight: '10px' }} variant="contained" color="primary" onClick={submitAddSelection}>{modal.id ? "Cập nhật" : 'Tạo'}</Button>
                        <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Thoát</Button>
                      </div>
                    </form>
                  </div>
                </Fade>
              </Modal>
            </div>
          </Paper>
        </div>
      }
    </>
  );
}
