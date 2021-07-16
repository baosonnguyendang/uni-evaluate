import React, { useState, useEffect } from 'react';

import axios from 'axios';

import DialogConfirm from '../../common/DialogConfirm';
import UserSettings from './admin-user-settings'
import Council from './admin-init-council'
import Classify from './admin-classify'
import Import from './admin-import-data'

import { useParams } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import { List, ListItem, ListItemAvatar, ListItemText, Divider } from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PostAddIcon from '@material-ui/icons/PostAdd';
import CategoryIcon from '@material-ui/icons/Category';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import HelpIcon from '@material-ui/icons/Help';
import Loading from '../../common/Loading'
import Skeleton from '../../common/Skeleton'

import VisibilityIcon from '@material-ui/icons/Visibility';
import ModifyForm from "../CreateEvaluation/CreateForm/CreateForm";
import DeleteIcon from '@material-ui/icons/Delete';
import { showModal, clearModal } from '../../../actions/modalAction'
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'

const useStyles = makeStyles(theme => ({
  paper: {
    minHeight: 350,
    marginTop: 24,
    position: 'relative',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper1: {
    position: 'absolute',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minHeight: 20,
  },
  field: {
    marginBottom: 10,
    width: 300
  },
  btn: {
    minWidth: 150,
  },
  formControl: {
    margin: theme.spacing(3),
    marginTop: 0,
    marginBottom: 0,
  },
  input: {
    width: '100%',
    marginTop: 6,
    padding: 5
  },
  tab: {
    backgroundColor: '#abcdef',
    padding: 0,
    width: '100%',
  },
  list: {
    backgroundColor: theme.palette.background.paper,
  },
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },

}))

const createData = (name, id) => {
  return { name, id, check: false }
}

// const units = [
//   createData('Khoa Máy tính', '0001'),
// ]

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

var unit = ''
var code = ''
var name = ''

export default function AddSettings() {
  const classes = useStyles()
  let { id, id1 } = useParams();
  const [loading, setLoading] = useState(true)
  //check form da duoc tao hay chua
  const dispatch = useDispatch()
  //ds don vi va ma don vi
  const [units, setUnits] = useState(null)
  const [restUnits, setRestUnits] = useState(null)
  //fe to be
  const fetchUnits = () => {
    axios.get('admin/department/parent')
      .then(res => {
        console.log(res.data.parents)
        let temp = []
        res.data.parents.map(x => {
          temp.push(createData(x.name, x.department_code))
          //setUnits(units => [...units, createData(x.name, x.department_code)])
        })
        axios.get(`/admin/form/${code}/getFormDepartments?level=2`)
          .then(res => {
            // console.log(res.data)
            let _id = res.data.formDepartments.map(x => x.department_id.department_code)
            _id.map(x => {
              temp.map(y => {
                if (y.id === x) {
                  y.check = true
                }
              })
            })
            setUnits([...temp])
            setUnitChosen(temp.filter(unit => unit.check === true))
            console.log(temp.filter(unit => unit.check === true))
            setRestUnits(temp.filter(unit => unit.check !== true && unit.id !== "HDDG"))
            setLoading(false)
          })
          .catch(e => console.log(e))
      })
      .catch(e => {
        console.log(e)
      })
  }

  //khoi tao Form, check form da duoc tao hay chua
  const [init, setInit] = React.useState(0)
  useEffect(() => {
    axios.get(`/admin/review/${id}/formtype/${id1}/form/`)
      .then(res => {
        // (res.data) && (setInit(false))
        if (res.data.form) {
          code = res.data.form.code
          name = res.data.form.name
          fetchUnits();
          // if (units.length == 0) {
          //   fetchUnits();
          // }
          setInit(2)
          setLoading(false)
        }
        else {
          setInit(1)
          setLoading(false)
        }
      })
      .catch(e => {
        console.log(e)
        setLoading(false)
      })
  }, [])

  const [ten, setTen] = useState('')
  const [ma, setMa] = useState('')

  const Init = () => {
    const handleSubmitInit = (e) => {
      e.preventDefault()
      setTen(name)
      setMa(code)
      setInit(2)
      axios.post(`/admin/review/${id}/formtype/${id1}/form/addForm`, { name: name, code: code })
        .then(res => {
          console.log(res)
        })
        .catch(e => {
          console.log(e)
        })
    }

    const [name, setName] = React.useState('')
    const [code, setC] = React.useState('')

    return (
      <div>
        <Typography component="h1" variant="h5" color="inherit" noWrap>
          Nhóm 0{group}
        </Typography>
        <Paper style={{ padding: 10 }} className={classes.paper}>
          <Typography component="h3" variant="h5" color="inherit">
            Tạo biểu mẫu đánh giá
          </Typography>
          <form onSubmit={handleSubmitInit} style={{ marginTop: 15 }}>
            <TextField id="code" required onChange={e => setC(e.target.value)} label="Mã biểu mẫu" variant="outlined" className={classes.field} />
            <br />
            <TextField id="name" required onChange={e => setName(e.target.value)} label="Tên biểu mẫu" variant="outlined" className={classes.field} />
            <br />
            <div style={{height: 120}}></div>
            <Button style={{ marginRight: '10px' }} type="submit" value='submit' variant="contained" color="primary" >Vào cấu hình</Button>
          </form>
        </Paper>
      </div>
    )
  }


  //danh sach nguoi trong khoa
  const [unitMember, setUnitMember] = useState([])
  const [loadUnitMember, setLoadUnitMember] = useState(true) // cai nay de hien cai loading ben ds ng trong khoa

  const group = 1

  const handleClose = () => {
    dispatch(clearModal())
  };
  //loading khi thêm đơn vị
  const [loadingCircle, setLoadingCircle] = useState(false)
  // thêm đƠn đánh giá
  const addFormDepartments = (data) => {
    handleClose()
    setLoadingCircle(true)
    axios.post(`/admin/form/${code}/addFormDepartments`, data)
      .then(res => {
        console.log(res.data)
        dispatch(showSuccessSnackbar('Thêm đơn vị đánh giá thành công'))
        units.forEach(element => {
          if (data.dcodes.includes(element.id)) { element.check = true; }
        });
        setUnitChosen(units.filter(unit => unit.check === true))
        setRestUnits(units.filter(unit => unit.check !== true && unit.id !== "HDDG"))
        console.log(units.filter(unit => unit.check === true))
        setLoadingCircle(false)
      })
      .catch(err => {
        console.log(err)
        dispatch(showErrorSnackbar('Thêm đơn vị đánh giá thất bại'))
        setLoadingCircle(false)
      })

  };
  // dialog xoá đơn vị
  const onDelete = id => {
    setStatusDelete({ open: true, onClick: () => removeFormDepartment(id) })
  }
  // xoá đơn vị
  const removeFormDepartment = (dcode) => {
    closeDialog()
    setLoadingCircle(true)
    axios.post(`/admin/form/${code}/${dcode}/delete`)
      .then(res => {
        console.log(res.data)
        units.forEach(element => {
          if (element.id === dcode) { element.check = false; }
        });
        setUnitChosen(units.filter(unit => unit.check === true))
        setRestUnits(units.filter(unit => unit.check !== true && unit.id !== "HDDG"))
        console.log(units.filter(unit => unit.check === true))
        dispatch(showSuccessSnackbar('Xoá đơn vị đánh giá thành công'))
        setLoadingCircle(false)
      })
      .catch(err => {
        console.log(err)
        dispatch(showErrorSnackbar('Xoá đơn vị đánh giá thất bại'))
        setLoadingCircle(false)
      })
  }

  const [unitChosen, setUnitChosen] = React.useState([])

  //chuyen sang trang chon nguoi duoc danh gia
  const [showResults, setShowResults] = React.useState(false);

  const SelectedUnit = () => {

    const openUnitt = (x) => {
      unit = x
      axios.get(`/admin/form/${code}/${unit}/getFormUser`)
        .then(res => {
          console.log(res.data)
          let temp = []
          res.data.formUser.map(x => {
            let name = x.user_id.department.length > 0 ? (x.user_id.department.map(d => d.name)).join(", ") : ''
            temp.push([x.user_id.lastname + ' ' + x.user_id.firstname, x.user_id.staff_id, name])
          })
          console.log(temp)
          setUnitMember(temp)
          setLoadUnitMember(false)
        })
        .catch(err => console.log(err))
      setShowResults(true)
    }
    if (!units) return <div style={{ minHeight: '250px', }}><Loading open /></div>
    return (
      <div style={{ minHeight: '250px', }}>
        <List style={{ marginTop: 10 }}>
          {unitChosen.map(unit =>
            <ListItem key={unit.id} id={unit.id} >
              <ListItemText primary={unit.name} />
              <IconButton onClick={() => openUnitt(unit.id)} >
                <VisibilityIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(unit.id)} >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          )}
        </List>
        {!unitChosen.length && <Typography>Không có đơn vị tham gia đánh giá</Typography>}
      </div>
    )
  }


  //chon truong don vi
  const [headTemp, setHeadTemp] = useState({ name: '', id: '' })//luu tam option dc chon trong chon truong don vi
  const [openHead, setOpenHead] = React.useState(false);
  const handleOpenHead = () => {
    console.log(unitMember)
    setOpenHead(true);
    closeDialog();
  };
  const handleCloseHead = () => {
    setOpenHead(false);
  };
  const submitHead = (e) => {
    console.log(unit)
    e.preventDefault()
    setOpenHead(false)
    setLoadingCircle(true)
    console.log(headTemp)
    axios.post(`/admin/form/${code}/${unit}/addHead`, { ucode: headTemp.id })
      .then(res => {
        console.log(res)
        setHead(headTemp)
        setLoadingCircle(false)
        dispatch(showSuccessSnackbar('Cập nhật trưởng đơn vị thành công'))
      })
      .catch(err => {
        console.log(err)
        setLoadingCircle(false)
        dispatch(showErrorSnackbar('Cập nhật trưởng đơn vị thất bại'))

      })
  }


  //them nguoi rieng le vao danh gia vui
  const [idd, setId] = React.useState('')
  const [info, setInfo] = useState(null) //hien thi thong tin user sau khi bam tim kiem trong them user vao hddg
  const [display, setDisplay] = useState('')

  const getInfo = () => {
    axios.get(`admin/user/${idd}/get`)
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


  const [openAdd, setOpenAdd] = React.useState(false);
  const handleOpenAdd = () => {
    setOpenAdd(true);
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setDisplay('')
  };
  const submitAdd = (e) => {
    e.preventDefault()
    setLoadingCircle(true)
    handleCloseAdd()
    axios.post(`/admin/form/${code}/${unit}/addFormUser`, { ucode: idd })
      .then(res => {
        axios.get(`admin/user/${idd}/get`)
          .then(res => {
            console.log(res.data)
            console.log([...unitMember, [res.data.user.lastname + ' ' + res.data.user.firstname, idd, '']])
            setUnitMember(unitMember => [...unitMember, [res.data.user.lastname + ' ' + res.data.user.firstname, idd, (res.data.user.department.map(d => d.name)).join(", ")]])
            setLoadingCircle(false)
            dispatch(showSuccessSnackbar('Thêm thành viên thành công'))
          })
          .catch(err => {
            console.log(err)
            dispatch(showErrorSnackbar('Thêm thành viên thất bại'))
            setLoadingCircle(false)
          })
      })
      .catch(err => {
        console.log(err)
        switch (err.response.status) {
          case 409:
            dispatch(showErrorSnackbar('Thành viên đã tồn tại trong đơn vị'))
            break;
          default:
            dispatch(showErrorSnackbar('Thêm thành viên thất bại'))
        }
        setLoadingCircle(false)
      })
  }

  const [newUnit, setNewUnit] = React.useState('');
  const handleChangeUnit = (event) => {
    setNewUnit(event.target.value);
  };

  //lay truong don vi 
  const [head, setHead] = useState({
    name: '',
    id: ''
  })

  //xac nhan thay doi truong don vi
  const [statusDelete, setStatusDelete] = useState({ open: false })
  const closeDialog = () => {
    setStatusDelete({ open: false })
  }
  const onAsk = () => {
    axios.get(`/admin/form/${code}/${unit}/getFormDepartment`)
      .then(res => {
        console.log(res.data)
        let obj = {
          name: res.data.formDepartment.head.lastname + ' ' + res.data.formDepartment.head.firstname,
          id: res.data.formDepartment.head.staff_id
        }
        setHead(obj)
        setStatusDelete({ open: true, onClick: handleOpenHead })
      })
      .catch(err => {
        console.log(err)
      })
  }

  const [stage, setStage] = useState(null) //menu

  const MenuEvaluate = () => {
    const classes = useStyles();
    const Menu = () => {
      return <List className={classes.list}>
        <ListItem button onClick={() => { setStage(1) }} >
          <ListItemAvatar>
            <SupervisorAccountIcon fontSize='large' color='action' />
          </ListItemAvatar>
          <ListItemText
            primary={<>Hội đồng đánh giá</>}
            secondary={"Cấu hình thành viên hội đồng đánh giá"}
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem button onClick={() => { setStage(2) }}>
          <ListItemAvatar>
            <GroupAddIcon fontSize='large' color='action' />
          </ListItemAvatar>
          <ListItemText
            primary={<>Đơn vị đánh giá</>}
            secondary={"Cấu hình các đợi vị tham gia đánh giá"}
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem button onClick={() => { setStage(3) }}>
          <ListItemAvatar>
            <PostAddIcon fontSize='large' color='action' />
          </ListItemAvatar>
          <ListItemText
            primary={"Cấu hình tiêu chuẩn"}
            secondary={"Thêm, chỉnh sửa tiêu chuẩn tiêu chí biểu mẫu"}
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem button onClick={() => { setStage(4) }}>
          <ListItemAvatar>
            <CategoryIcon fontSize='large' color='action' />
          </ListItemAvatar>
          <ListItemText
            primary={'Cấu hình xếp loại'}
            secondary={"Các hạng mức xếp loại, điều kiện"}
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem button onClick={() => { setStage(5) }}>
          <ListItemAvatar>
            <ImportContactsIcon fontSize='large' color='action' />
          </ListItemAvatar>
          <ListItemText
            primary={'Thêm dữ liệu có sẵn'}
            secondary={"Các dữ liệu để xét điểm cho tiêu chí"}
          />
        </ListItem>
      </List>
    }
    let body = null
    switch (stage) {
      case 1:
        body = <Council fcode={code} />
        break
      case 2:
        body = (
          <div>
            <Loading open={loadingCircle} />
            <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h5" color="inherit">
                Các đơn vị tham gia đánh giá
              </Typography>
              <Tooltip title={
                <Typography variant='subtitle2'>Chọn đơn vị để xem thành viên tham gia đánh giá</Typography>
              }>
                <HelpIcon fontSize='small' color='action' />
              </Tooltip>
            </div>

            <SelectedUnit />
            <Button variant="contained" color="primary" className={classes.btn} onClick={() => { dispatch(showModal(addFormDepartments, "ADD_UNIT_MODAL", restUnits)) }}>
              Thêm đơn vị
            </Button>
          </div>
        )
        break
      case 3:
        body = <ModifyForm fcode={code} />
        break
      case 4:
        body = <Classify fcode={code} />
        break
      case 5:
        body = <Import fcode={code} />
        break
      default:
        body = <Menu />
    }
    return (
      <div style={{ maxWidth: '100%', }}>
        <div style={{}} className={classes.root1}>
          {!stage && <Typography style={{ flexGrow: 1, marginLeft: 10 }} variant='h5' gutterBottom>Cấu hình biểu mẫu</Typography>}
        </div>
        {body}
      </div>
    )
  }

  return (
    <div>
      {loading ? <Skeleton /> : (() => {
        switch (init) {
          default:
            return null
          case 1:
            return (
              <Init />
            )
          case 2:
            return (
              <div>
                {showResults ? (
                  <div>
                    <Loading open={loadingCircle} />
                    <Typography component="h1" variant="h5" color="inherit" noWrap>
                      Nhóm 0{group} - {units.find(x => x.id == unit).name}
                    </Typography>
                    <div style={{ paddingBottom: 57 }} className={classes.paper}>
                      <UserSettings unit={unit} type={id1} fcode={code} data={unitMember} loading={loadUnitMember} setUnitMember={setUnitMember} />
                      <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} text={`Trưởng Đơn vị đang là ${head.name} (${head.id}), có muốn thay đổi?`} />
                      <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                        <Button variant="contained" style={{ marginRight: 10, width: 200 }} onClick={() => { onAsk() }}>
                          Trưởng đơn vị
                        </Button>
                        <Button variant="contained" color="primary" style={{ marginRight: 10, width: 200 }} onClick={() => { handleOpenAdd() }}>
                          Thêm GV/VC
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => { setShowResults(false); setUnitMember([]); setLoadUnitMember(true) }}>
                          Trở lại
                        </Button>
                      </div>
                    </div>
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
                          <Typography variant='h5' gutterBottom >Trưởng đơn vị</Typography>
                          <form onSubmit={submitHead}>
                            <Autocomplete
                              id="combo-box-demo"
                              options={unitMember || []}
                              getOptionDisabled={(option) => option[1] == head.id}
                              getOptionLabel={(option) => `${option[0]} (${option[1]})`}
                              fullWidth
                              onChange={(event, value) => value && setHeadTemp({ name: value[0], id: value[1] })}
                              renderInput={(params) => <TextField {...params} label="Trưởng đơn vị" variant="outlined" />}
                            />
                            <div style={{ float: 'right', marginTop: '10px' }}>
                              <Button style={{ marginLeft: '10px' }} variant="contained" onClick={handleCloseHead}>Thoát</Button>
                              &nbsp;  &nbsp;
                              <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >Lưu</Button>
                            </div>
                          </form>
                        </div>
                      </Fade>
                    </Modal>
                    <Modal
                      className={classes.modal}
                      open={openAdd}
                      onClose={handleCloseAdd}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 500,
                      }}
                    >
                      <Fade in={openAdd}>
                        <div className={classes.paper1} style={{ width: 500 }}>
                          <Typography variant='h5' gutterBottom>Thêm GV/VC</Typography>
                          <form onSubmit={submitAdd}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <TextField fullWidth size='small' onChange={e => setId(e.target.value)} id="id" label="Mã GV/VC" required variant="outlined" />
                              <IconButton variant='contained' color='primary' onClick={getInfo}>
                                <SearchIcon />
                              </IconButton>
                            </div>
                            <Typography style={{ marginTop: '10px' }}>{display}</Typography>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                              <Button style={{ marginLeft: '10px' }} variant="contained" onClick={handleCloseAdd}>Thoát</Button>
                              &nbsp;&nbsp;
                              <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >Thêm</Button>
                            </div>
                          </form>
                        </div>
                      </Fade>
                    </Modal>
                  </div>
                ) : (
                  <div>
                    <Typography component="h1" variant="h5" color="inherit" noWrap>
                      {ten ? ten : name} (Mã biểu mẫu: {ma ? ma : code})
                    </Typography>
                    <Paper style={{ padding: 10 }} className={classes.paper}>
                      <MenuEvaluate />
                    </Paper>
                    {stage && <Button style={{ width: 80, float: 'right', marginTop: 10 }} variant="contained" onClick={() => { setStage(null) }} ><KeyboardReturnIcon /></Button>}
                  </div >
                )
                }
              </div >
            )
        }
      })()}
    </div>
  )
}