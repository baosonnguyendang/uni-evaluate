import React, { useState, useEffect } from 'react'

import axios from 'axios'

import './styles.css';

import { makeStyles } from '@material-ui/core/styles';

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
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'
import Loading from '../../common/Loading'
import DialogConfirm from '../../common/DialogConfirm'

const useStyles = makeStyles((theme) => ({
  list: {
    display: 'contents',
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  btn: {
    position: 'absolute',
    bottom: '10px',
  },
  btnmin: {
    minWidth: 80
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper1: {
    position: 'absolute',
    width: '35vw',
    minWidth: '400px',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  formControl: {
    minWidth: 300
  },
}));

export default function Council(props) {
  const classes = useStyles();
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  //open modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setInfo()
    setDisplay('')
  };

  //open modal head
  const [openHead, setOpenHead] = React.useState(false);
  const handleOpenHead = () => {
    setOpenHead(true);
  };
  const handleCloseHead = () => {
    setOpenHead(false);
  };

  const [id, setId] = useState() //id cua nguoi duoc xoa
  const [loadingButton, setLoadingButton] = useState(false)
  const [chose, setChose] = useState(null) //kiem tra form da co hddg chua
  const [council, setCouncil] = useState() //dung de luu dvi hddg luc khoi tao form
  const [unit, setUnit] = useState([]) //chon dvi hddg luc khoi tao form
  const [head, setHead] = useState() //dai dien hddg
  const [code, setCode] = useState() //mã hddg

  const [member, setMember] = useState([]) //cac thanh vien trong hddg dot nay
  const [info, setInfo] = useState(null) //hien thi thong tin user sau khi bam tim kiem trong them user vao hddg

  const remove = (id) => {
    let item = member.slice()
    item = item.filter(x => x.id !== id)
    setLoading(true)
    closeDialog()
    axios.post(`/admin/form/${props.fcode}/${code}/removeFormUser`, { delete_users: [id] })
      .then(res => {
        console.log(item)
        setMember(item)
        setLoading(false)
        dispatch(showSuccessSnackbar('Xoá thành công'))
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
        dispatch(showErrorSnackbar('Xoá thất bại'))
      })
  }

  const submit = e => {
    e.preventDefault()
    let item = member.slice()
    console.log(id)
    setLoading(true)
    handleClose()
    axios.post(`/admin/form/${props.fcode}/${code}/addFormUser`, { ucode: id })
      .then(res => {
        axios.get(`admin/user/${id}/get`)
          .then(res => {
            setInfo(res.data.user.lastname + ' ' + res.data.user.firstname)
            let obj = { id: id, name: res.data.user.lastname + ' ' + res.data.user.firstname, role: null }
            item.push(obj)
            setMember(item)
            setLoading(false)
            dispatch(showSuccessSnackbar('Thêm thành viên thành công'))
          })
          .catch(err => {
            console.log(err)
            setLoading(false)
          })

      })
      .catch(err => {
            setLoading(false)
            dispatch(showErrorSnackbar('Thêm thành viên thất bại'))
            console.log(err)
      })
  }

  useEffect(() => {
    setLoading(true)
    axios.get(`/admin/department`)
      .then(res => {
        let temp = [res.data.departments.find(x => x.department_code == 'HDDG')]
        setUnit([...temp])
      })
    axios.get(`/admin/form/${props.fcode}/checkCouncil`)
      .then(res => {
        console.log(res.data)
        setCode(res.data.formDepartment.department_id.department_code)
        if (res.data.formDepartment.department_id) {
          setChose(true)
          setHead(res.data.formDepartment.head.staff_id)
          let h = res.data.formDepartment.head.staff_id
          axios.get(`/admin/form/${props.fcode}/${res.data.formDepartment.department_id.department_code}/formuser/get`)
            .then(res => {
              let man = []
              console.log(res.data)
              res.data.formUsers.map(x => {
                let obj = { id: x.user_id.staff_id, name: x.user_id.lastname + ' ' + x.user_id.firstname, role: null }
                man.push(obj)
              })
              if (man.some(x => x.id == h)) {
                man.find(x => x.id == h).role = 'Đại diện HĐĐG'
              }
              setMember([...man])
              setLoading(false)
            })
            .catch(err => {
              console.log(err)
              setLoading(false)
            })
        }
        else {
          setChose(false)
        }
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  //chon don vi hoi dong danh gia luc moi khoi tao
  const handleChange = (event) => {
    const name = event.target.value;
    setCouncil(name)
    console.log(name)
  };

  //select chon nguoi lam dai dien hddg
  const handleHead = (event) => {
    setHead(event.target.value)
    //member.find(x => x.id == event.target.value).role = 'Đại diện HĐĐG'
  }

  //xac nhan chon nguoi lam dai dien hddg
  const submitHead = () => {
    console.log(head)
    setLoading(true)
    let dcode = 'HDDG'
    handleCloseHead()
    axios.post(`/admin/form/${props.fcode}/${dcode}/addHead`, { ucode: head })
      .then(res => {
        member.map(x => x.role = null)
        member.find(x => x.id == head).role = 'Đại diện HĐĐG'
        dispatch(showSuccessSnackbar('Chọn đại diện thành công'))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        dispatch(showErrorSnackbar('Chọn đại diện thất bại'))
        setLoading(false)
      })
  }

  const [display, setDisplay] = useState('')

  const getInfo = () => {
    axios.get(`admin/user/${id}/get`)
      .then(res => {
        console.log(res)
        setInfo(res.data.user.lastname + ' ' + res.data.user.firstname)
        setDisplay('Tên: ' + res.data.user.lastname + ' ' + res.data.user.firstname)
      })
      .catch(err => {
        console.log(err)
        setDisplay('Không tồn tại mã GV/VC')
      })
  }

  //luc moi khoi tao, bam vao se hoan tat viec chon dvi hddg, lay toan bo user trong dvi do bo vao hddg
  const setHDDG = () => {
    setLoading(true)
    axios.post(`/admin/form/${props.fcode}/${council}/addcouncil`, {})
      .then(res => {
        console.log(res.data)
        setCode(council)
        dispatch(showSuccessSnackbar('Thêm HĐĐG thành công'))
        axios.get(`/admin/form/${props.fcode}/${council}/formuser/get`)
          .then(res => {
            let man = []
            res.data.formUsers.map(x => {
              let obj = { id: x.user_id.staff_id, name: x.user_id.lastname + ' ' + x.user_id.firstname, role: null }
              man.push(obj)
            })
            console.log(res.data)
            setMember([...man])
            setChose(true)
            setLoading(false)
          })
          .catch(err => {
            setLoading(false)
            console.log(err)
          })
      })
      .catch(err => {
        setLoading(false)
        dispatch(showErrorSnackbar('Thêm HĐĐG thất bại'))
        console.log(err)
      })
  }
  // modal xoá
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => remove(id) })
  }

  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  if (chose === null) return <Loading open />
  return (
    <div>
      <Loading open={loading} />
      <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
      {chose ? (
        <div>
          <Typography component="h3" variant="h5" color="inherit" >
            Danh sách hội đồng đánh giá cấp trường:
          </Typography>
          <div className={classes.btn} >
            <Button onClick={handleOpen} style={{ marginRight: '10px' }} variant="contained" color="primary">Thêm thành viên vào HĐĐG</Button>
            <Button onClick={handleOpenHead} variant="contained" color="secondary">Chọn Đại diện cho HĐĐG</Button>
          </div>
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
                    <IconButton edge="end" aria-label="delete" onClick={() => onDelete(x.id)}>
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
                <Typography variant='h6' style={{ marginBottom: '15px' }}>Thêm thành viên vào hội đồng:</Typography>
                <form onSubmit={submit}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField size='small' style={{ width: '100%' }} onChange={e => setId(e.target.value)} id="code" label="Mã GV/VC" variant="outlined" />
                    <IconButton variant='contained' color='primary' onClick={getInfo}>
                      <SearchIcon />
                    </IconButton>
                  </div>
                    <Typography style={{ marginTop: '10px' }}>{display}</Typography>
                  <div style={{ justifyContent: 'flex-end', marginTop: '10px', display: 'flex' }}>
                    <Button className={classes.btnmin} onClick={handleClose} variant="contained" >Thoát</Button>
                    &nbsp;  &nbsp;
                    <Button className={classes.btnmin} type="submit" variant="contained" color="primary">Thêm</Button>
                  </div>
                </form>
              </div>
            </Fade>
          </Modal>
          <Modal
            className={classes.modal}
            open={openHead}
            onClose={handleCloseHead}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={openHead}>
              <div className={classes.paper1}>
                <Typography variant='h5' style={{ marginBottom: '15px' }}>Chọn đại diện hội đồng:</Typography>
                <FormControl variant="outlined" className={classes.formControl} fullWidth>
                  <InputLabel htmlFor="outlined-age-native-simple">Đại diện</InputLabel>
                  <Select
                    native

                    value={head}
                    onChange={handleHead}
                    label="Đại diện"
                    inputProps={{
                      name: 'HĐĐG',
                    }}
                  >
                    <option aria-label="None" value="" />
                    {member.length > 0 && member.map(x => {
                      return (
                        <option key={x.id} value={x.id} >{x.name} ({x.id})</option>
                      )
                    })}
                  </Select>
                </FormControl>
                <div style={{ justifyContent: 'flex-end', display: 'flex', marginTop: '10px' }}>
                  <Button className={classes.btnmin} onClick={handleCloseHead} variant="contained" >Thoát</Button>
                  &nbsp;  &nbsp;
                  <Button className={classes.btnmin} onClick={submitHead} variant="contained" color="primary">Chọn</Button>
                </div>
              </div>
            </Fade>
          </Modal>
        </div>
      ) : (
        <>
          <Typography component="h4" variant="h5" color="inherit" >
            Thêm Hội đồng đánh giá cấp Trường:
          </Typography>
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
          </FormControl>
          <div style={{ minHeight: 190 }}></div>
          <Button style={{ minWidth: 150 }} onClick={setHDDG} variant="contained" color="primary">Thêm HĐĐG</Button>
        </>
      )}

    </div>
  )
}