import React, { useState, useEffect } from 'react'

import axios from 'axios'

import './styles.css';

import { makeStyles } from '@material-ui/core/styles';

import ButtonCustom from '../../common/ButtonCustom'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import PersonIcon from '@material-ui/icons/Person';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  list: {
    display: 'contents',
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  btn: {
    position: 'absolute',
    bottom: '10px'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper1: {
    position: 'absolute',
    width: '35vw',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Council(props) {
  const classes = useStyles();

  const token = localStorage.getItem('token')

  //open modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [id, setId] = useState()
  const [loadingButton, setLoadingButton] = useState(false)
  const [chose, setChose] = useState(false)
  const [council, setCouncil] = useState()
  const [unit, setUnit] = useState([])

  const [member, setMember] = useState([
    { id: '1111', name: 'Mai Thanh Phong', role: 'Hiệu trưởng' },
    { id: '1112', name: 'Bùi Hoài Thắng', role: 'Phòng Đào tạo' }
  ])

  const remove = (id) => {
    let item = member.slice()
    item = item.filter(x => x.id != id)
    setMember(item)
  }

  const submit = e => {
    e.preventDefault()
    let item = member.slice()
    let obj = { id: id, name: 'name', role: 'role' }
    item.push(obj)
    setMember(item)
    setLoadingButton(true)
    axios.post()
      .then(res => {
        setLoadingButton(false)
        handleClose()
      })
  }

  useEffect(() => {
    axios.get(`/admin/department`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        let temp = [res.data.departments.find(x => x.department_code == 'HDDG')]
        setUnit([...temp])
      })
    axios.get(`/admin/department/HDDG/user`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        res.data.user.map(x => {
          console.log(x)
        })
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const handleChange = (event) => {
    const name = event.target.value;
    setCouncil(name)
    console.log(name)
  };

  const setHDDG = () => {
    axios.post(`/admin/form/${props.fcode}/${council}/addcouncil`, {},{ headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        axios.get(`/admin/form/${props.fcode}/${council}/formuser/get`, { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => {
          console.log(res.data)
          setChose(true)
        })
        .catch(err => {
          console.log(err)
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div>
      {chose ? (
        <div>
          <Typography component="h3" variant="h5" color="inherit" >
            Danh sách Hội đồng đánh giá cấp Trường:
        </Typography>
          <Button onClick={handleOpen} className={classes.btn} variant="contained" color="primary">Thêm thành viên vào HĐĐG</Button>
          <List id='list' className={classes.list}>
            {member.map(x => {
              return (
                <ListItem key={x.id} className={classes.item}>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={x.name} secondary={x.role} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => { remove(x.id) }}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })}
          </List>
          <Modal
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
                <h5 style={{ marginBottom: '10px' }}>Thêm thành viên vào Hội đồng:</h5>
                <form onSubmit={submit}>
                  <TextField onChange={e => setId(e.target.value)} id="code" label="Mã GV/VC" variant="outlined" fullWidth />
                  <div style={{ justifyContent: 'center', marginTop: '10px', display: 'flex' }}>
                    <ButtonCustom loading={loadingButton} type="submit" variant="contained" color="primary">Thêm</ButtonCustom>
                    <ButtonCustom handleButtonClick={handleClose} onClick={handleClose} variant="contained" color="primary">Thoát</ButtonCustom>
                  </div>
                </form>
              </div>
            </Fade>
          </Modal>
        </div>
      ) : (
        <div>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel htmlFor="outlined-age-native-simple">HĐĐG</InputLabel>
            <Select
              native
              value={council}
              onChange={handleChange}
              label="HĐĐG"
              inputProps={{
                name: 'HĐĐG',
              }}
            >
              <option aria-label="None" value="" />
              {unit.length > 0 && unit.map(x => {
                return (
                  <option key={x._id} value={x.department_code} aria-label="None" >{x.name}</option>
                )
              })}
            </Select>
            <ButtonCustom loading={loadingButton} onClick={setHDDG} variant="contained" color="primary">Thêm HĐĐG</ButtonCustom>
          </FormControl>
        </div>
      )}

    </div>
  )
}