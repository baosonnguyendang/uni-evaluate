import React, { useState, useEffect } from "react";

import { useParams, useHistory, useRouteMatch } from 'react-router-dom';

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import EditIcon from "@material-ui/icons/EditOutlined";
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import Loading from '../../common/Loading'
import Skeleton from '../../common/Skeleton'
import DialogConfirm from '../../common/DialogConfirm'
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import { Link } from 'react-router-dom'

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

const CustomTableCell = ({ row, name, }) => {
  const classes = useStyles();
  return (
    <TableCell align="left" className={classes.tableCell}>
      {row[name]}
    </TableCell>
  );
};


export default function Selection() {
  const dispatch = useDispatch()
  const [rows, setRows] = React.useState(null);
  const classes = useStyles();
  const { id1 } = useParams();
  //token
  const token = localStorage.getItem('token');
  const config = { headers: { "Authorization": `Bearer ${ token }` } };

  const fetchSelection = () => {
    axios.get(`/admin/criteria/${ id1 }/option`, config)
      .then(res => {
        const selections = res.data.criteriaOptions;
        // console.log(selections)
        setNameCriteria(res.data.criteria.name)
        setRows(res.data.criteriaOptions)
        // setIsLoading(false)
      })
  }
  useEffect(() => {
    fetchSelection()
  }, [])
  // modal xo??
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => deleteOptionWithAPI(id) })
  }
  // delete options
  const deleteOptionWithAPI = (id) => {
    setLoading(true)
    closeDialog()
    axios.post(`/admin/criteria/option/${ id }/delete`, {}, { headers: { "Authorization": `Bearer ${ token }` } })
      .then(res => {
        const newRows = rows.filter(row => row.code !== id)
        setRows(newRows)
        dispatch(showSuccessSnackbar('Xo?? l???a ch???n th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err.response.status)
        dispatch(showErrorSnackbar('Xo?? l???a ch???n th???t b???i'))
        setLoading(false)
      })
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
  const editSelection = (e, id) => {
    e.preventDefault()
    const body = { new_ocode: code, name, description, max_point: point }
    setLoading(true)
    // console.log(modal.id)

    handleClose()
    axios.post(`/admin/criteria/option/${ id }/edit`, body, { headers: { "Authorization": `Bearer ${ token }` } })
      .then(res => {
        setRows(rows.map(r => r.code === id ? { ...r, code, name, description } : r))
        dispatch(showSuccessSnackbar('C???p nh???t l???a ch???n th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('M?? l???a ch???n ???? t???n t???i'))
            break;
          default:
            dispatch(showErrorSnackbar('C???p nh???t l???a ch???n th???t b???i'))
            break;
        }
        setLoading(false)
      })
  }
  // loading add selection
  const [loading, setLoading] = useState(false)

  // T???o l???a ch???n
  const submitAddSelection = (e) => {
    // console.log(code, name, description, point);
    handleClose();
    setLoading(true)
    e.preventDefault()
    const body = {
      code,
      name,
      max_point: point,
      description
    }
    axios.post(`/admin/criteria/${ id1 }/addCriteriaOption`, body, config)
      .then(res => {
        // console.log(res.data);
        setRows(row => [...row, { name, code, description, max_point: point }])
        dispatch(showSuccessSnackbar('T???o l???a ch???n th??nh c??ng'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        switch (err.response?.status) {
          case 409:
            dispatch(showErrorSnackbar('M?? l???a ch???n ???? t???n t???i'))
            break;
          default:
            dispatch(showErrorSnackbar('T???o l???a ch???n th???t b???i'))
            break;
        }
        setLoading(false)
      })
  }
  const [nameCriteria, setNameCriteria] = useState(null)
  //get data from new criterion
  const [name, setName] = React.useState('')
  const [code, setCode] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [point, setPoint] = React.useState(0)

  function Criteria() {
    let { id1 } = useParams();
    return (
      < Typography component="h1" variant="h5" color="inherit" noWrap >
        Ti??u ch?? {nameCriteria} - Danh s??ch l???a ch???n
      </Typography >
    )
  }
  let history = useHistory();
  let { url } = useRouteMatch();
  const redirectStorePage = () => {
    history.push(`${ url }/deleted`)
  }

  return (
    <>
      {!rows ? <Skeleton /> :
        <div>
          <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
          <Loading open={loading} />
          <Criteria />
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                  <TableCell className={classes.number} >M?? </TableCell>
                  <TableCell className={classes.name} >L???a ch???n </TableCell>
                  <TableCell className={classes.description}>M?? t???</TableCell>
                  <TableCell >??i???m</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row._id}>
                    <CustomTableCell className={classes.name} {...{ row, name: "code", }} />
                    <CustomTableCell className={classes.number} {...{ row, name: "name", }} />
                    <CustomTableCell {...{ row, name: "description", }} />
                    <CustomTableCell {...{ row, name: "max_point", }} />
                    <TableCell className={classes.selectTableCell}>
                      <Tooltip title='S????a'>
                        <IconButton
                          aria-label="delete"
                          onClick={() => onEdit(row.code)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Xo??a'>
                        <IconButton
                          aria-label="delete"
                          onClick={() => onDelete(row.code)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && <TableRow><TableCell colSpan={5}>Kh??ng c?? l???a ch???n</TableCell></TableRow>}
              </TableBody>
            </Table>
            <div style={{ margin: 10, justifyContent: 'space-between', display: 'flex' }}>
              <Button variant="contained" className={classes.btn} onClick={redirectStorePage}>
                Kh??i ph???c
              </Button>
              <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
                Th??m l???a ch???n
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
                    <Typography variant='h5' gutterBottom id="transition-modal-title">{modal.id ? "C???p nh???t l???a ch???n" : 'Th??m l???a ch???n'}</Typography>
                    <form onSubmit={modal.id ? ((e) => editSelection(e, modal.id)) : submitAddSelection}>
                      <TextField onChange={e => setCode(e.target.value)} id="code" label="M??" variant="outlined" fullWidth autoFocus required margin='normal' defaultValue={modal.id && code} />
                      <TextField onChange={e => setName(e.target.value)} id="name" label="T??n" variant="outlined" fullWidth required margin='normal' defaultValue={modal.id && name} />
                      <TextField onChange={e => setDescription(e.target.value)} id="description" label="M?? t???" multiline fullWidth variant="outlined" margin='normal' defaultValue={modal.id && description} />
                      <TextField onChange={e => setPoint(e.target.value)} id="point" label="??i???m" type="number" fullWidth required variant="outlined" margin='normal' defaultValue={modal.id && point} />
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Button style={{ marginRight: '10px' }} variant="contained" color="primary" type='submit' >{modal.id ? "C???p nh???t" : 'T???o'}</Button>
                        <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Tho??t</Button>
                      </div>
                    </form>
                  </div>
                </Fade>
              </Modal>
            </div>
          </Paper>
          <Link to={url.replace('/' + id1, '')} component={Button} className={classes.btnback} variant="contained" style={{ float: 'right' }} ><KeyboardReturnIcon /></Link>
        </div>
      }
    </>
  );
}
