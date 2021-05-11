import React, { useEffect, useState } from "react";
import { Link, useParams, useRouteMatch } from 'react-router-dom';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { makeStyles } from "@material-ui/core/styles";
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

const createData = (name, code, description, point, type) => ({
  id: code,
  name,
  code,
  description,
  point,
  type,
  isEditMode: false
});

const CustomTableCell = ({ row, name, onChange }) => {
  const classes = useStyles();
  const { isEditMode } = row;
  let { url } = useRouteMatch();

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
        name === 'name' ? (<Link to={`${url}/${row['code']}`} style={{ color: 'black' }}>{row[name]}</Link>) : (row[name])
      )}
    </TableCell>
  );
};

// component={Link} href={window.location.href + '/a'}

export default function Criteria() {
  const [rows, setRows] = React.useState([
    createData("Định mức giờ chuẩn hoàn thành", '00101', 'BÙm bùm bùm bùm', 5),
    createData("Kết quả khảo sát chất lượng dịch vụ", '00102', 'Mô tảaaaaaaaaaaaaaaaaaaaaaa', 7),
    createData("Hình thức giảng dạy khác", '00103', 'Description', 10)
  ]);
  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem('token')
  const config = { headers: { "Authorization": `Bearer ${token}` } }
  const { id } = useParams()
  const [nameStandard, setNameStandard] = useState('')
  const fetchCriteriaOfStandard = () => {
    axios.get(`admin/standard/${id}/criteria`, config)
      .then(res => {
        console.log(res.data.criterions)
        setRows(res.data.criterions)
        setNameStandard(res.data.standard.name)
        setIsLoading(false)
      })
  }
  useEffect(() => {
    fetchCriteriaOfStandard()
  }, [])

  const onToggleEditMode = id => {
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
    if (!previous[row.id]) {
      setPrevious(state => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map(row => {
      if (row._id === id) {
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
    const newRows = rows.map(row => {
      if (row._id === id) {
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

  //sumbit form tao tieu chi
  const submitAddCriteria = ()=>{
    console.log(name, code, description, point, type);
  }

  //get data from new criterion
  const [name, setName] = React.useState('')
  const [code, setCode] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [point, setP] = React.useState(0)
  const [type, setType] = React.useState('');
  const handleChangeType = (event) => {
    setType(event.target.value); 
  };
  const submit = e => {
    e.preventDefault()
    setRows(rows => [...rows, createData(name, code, description, point, type)])
  }

  return (
    <>
      {isLoading ? <Skeleton /> : (
        <div>
          <Typography component="h1" variant="h5" color="inherit" noWrap >
            Tiêu chuẩn {nameStandard} - DS Tiêu chí
          </Typography >
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                  <TableCell className={classes.number} >Mã tiêu chí</TableCell>
                  <TableCell className={classes.name} >Tên tiêu chí</TableCell>
                  <TableCell >Mô tả</TableCell>
                  <TableCell >Kiểu đánh giá</TableCell>
                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row._id}>
                    <CustomTableCell className={classes.number} {...{ row, name: "code", onChange }} />
                    <CustomTableCell className={classes.name} {...{ row, name: "name", onChange }} />
                    <CustomTableCell {...{ row, name: "description", onChange }} />
                    <CustomTableCell {...{ row, name: "type", onChange }} />
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
                ))}
              </TableBody>
            </Table>
            <div style={{ margin: '10px', textAlign: 'right' }}>
              <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                Tạo tiêu chí mới
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
                    <h2 id="transition-modal-title">Thêm tiêu chí</h2>
                    <form onSubmit={submit}>
                      <TextField onChange={e => setCode(e.target.value)} id="code" required label="Mã tiêu chí" variant="outlined" fullWidth className={classes.field} />
                      <TextField onChange={e => setName(e.target.value)} id="name" required label="Tên tiêu chí" variant="outlined" fullWidth className={classes.field} />
                      <TextField onChange={e => setDescription(e.target.value)} id="description" label="Mô tả" multiline fullWidth variant="outlined" className={classes.field} />
                      <FormControl fullWidth variant="outlined" >
                        <InputLabel >Kiểu đánh giá</InputLabel>
                        <Select
                          native
                          required
                          value={type}
                          label='Kiểu đánh giá'
                          onChange={handleChangeType}
                        >
                          <option aria-label="None" value="" />
                          <option value={'checkbox'}>Checkbox</option>
                          <option value={'radio'}>Radio</option>
                          <option value={'input'}>Input</option>
                        </Select>
                      </FormControl>
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" onClick={submitAddCriteria}>Tạo</Button>
                        <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Thoát</Button>
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
