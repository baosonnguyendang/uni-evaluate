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
import Checkbox from '@material-ui/core/Checkbox';
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

import Skeleton from '../../common/Skeleton'

import ModifyForm from "../CreateEvaluation/CreateForm/CreateForm";

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
    marginBottom: 10
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

  //ds don vi va ma don vi
  const [units, setUnits] = useState([])

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

  const Init = () => {
    const handleSubmitInit = (e) => {
      e.preventDefault()
      setInit(false)
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
            Tạo mẫu đánh giá
          </Typography>
          <form onSubmit={handleSubmitInit} style={{ marginTop: 15 }}>
            <TextField id="code" required onChange={e => setC(e.target.value)} label="Mã Form" variant="outlined" className={classes.field} />
            <br />
            <TextField id="name" required onChange={e => setName(e.target.value)} label="Tên Form" variant="outlined" className={classes.field} />
            <br />
            <Button style={{ marginRight: '10px' }} type="submit" value='submit' variant="contained" color="primary" >Vào cấu hình</Button>
          </form>
        </Paper>
      </div>
    )
  }

  //cai nay la de sau khi check hoac uncheck se render lai luon
  const [state, setState] = React.useState(true);

  //danh sach nguoi trong khoa
  const [unitMember, setUnitMember] = useState([])

  const group = 1

  //open modal them don vi
  const [openUnit, setOpenUnit] = React.useState(false);
  const handleOpenUnit = () => {
    console.log(units)
    console.log(unitChosen)
    setOpenUnit(true);
  };
  const handleCloseUnit = () => {
    setUnitChosen(units.filter(unit => unit.check === true))
    console.log(units.filter(unit => unit.check === true).map(x => x.id))
    axios.post(`/admin/form/${code}/addFormDepartments/v2`, { dcodes: units.filter(unit => unit.check === true).map(x => x.id) })
      .then(res => {
        setOpenUnit(false);
      })
      .catch(e => {
        console.log(e)
      })

  };

  const [unitChosen, setUnitChosen] = React.useState([])

  //chuyen sang trang chon nguoi duoc danh gia
  const [showResults, setShowResults] = React.useState(false);

  const SelectedUnit = () => {
    let bool = false;

    const openUnitt = (x) => {
      unit = x
      axios.get(`/admin/form/${code}/${unit}/getFormUser`)
        .then(res => {
          let temp = []
          res.data.formUser.map(x => {
            let name = x.user_id.department.length > 0 ? x.user_id.department[0].name : ''
            temp.push([x.user_id.lastname + ' ' + x.user_id.firstname, x.user_id.staff_id, name])
          })
          console.log(temp)
          setUnitMember(temp)
        })
        .catch(err => console.log(err))
      setShowResults(true)
    }

    return (
      <div style={{ minHeight: '250px', }}>
        <List  style={{ marginTop: 10 }}>
          {units.filter(x => x.id != 'HDDG').map(unit => {
            if (unit.check) {
              bool = true;
              return (
                <ListItem button key={unit.id} id={unit.id} onClick={() => openUnitt(unit.id)}>
                  <ListItemText primary={unit.name} />
                </ListItem>
              )
            }
          })}
        </List>
        {!bool && <Typography>(Không có đơn vị nào nằm trong nhóm)</Typography>}
      </div>
    )
  }

  //change tab
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
    console.log(headTemp)
    axios.post(`/admin/form/${code}/${unit}/addHead`, { ucode: headTemp.id })
      .then(res => {
        console.log(res)
        setHead(headTemp)
        setOpenHead(false)
      })
      .catch(err => {
        alert(err)
        setOpenHead(false)
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
  };
  const submitAdd = (e) => {
    e.preventDefault()
    axios.post(`/admin/form/${code}/${unit}/addFormUser`, { ucode: idd })
      .then(res => {
        axios.get(`admin/user/${idd}/get`)
          .then(res => {
            console.log(res.data)
            setUnitMember(unitMember => [...unitMember, [res.data.user.lastname + ' ' + res.data.user.firstname, idd, '']])
            handleCloseAdd()
          })
          .catch(err => {
            console.log(err)
            handleCloseAdd()
          })
          .catch(err => {
            console.log(err)
            handleCloseAdd()
          })
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography component="h3" variant="h5" color="inherit">
              Các đơn vị tham gia đánh giá 
            </Typography>
            <Tooltip title={
                    <Typography variant='subtitle2'>Chọn đơn vị để xem thành viên tham gia đánh giá</Typography>
                }>
                        <HelpIcon fontSize='small' color='action' />
                </Tooltip>
            </div>
            <SelectedUnit />
            <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpenUnit}>
              Thêm đơn vị 
            </Button>
            <Modal
              className={classes.modal}
              open={openUnit}
              onClose={handleCloseUnit}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openUnit}>
                <div className={classes.paper1}>
                  <h4>Thêm đơn vị vào nhóm</h4>
                  <Autocomplete
                    multiple
                    options={units}
                    disableCloseOnSelect
                    defaultValue={unitChosen}
                    getOptionLabel={(option) => option.name}
                    renderOption={(option, { selected }) => (
                      <React.Fragment>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={option.check = selected}
                          onChange={console.log(units.map(x => x.check))}
                        />
                        {option.name}
                      </React.Fragment>
                    )}
                    style={{ width: 500 }}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" label="Đơn vị" placeholder="Đơn vị" />
                    )}
                  />
                  <Button style={{ marginTop: '10px', marginRight: 10 }} variant="contained" color="primary" onClick={() => handleCloseUnit()}>Xong</Button>
                  <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={() => setOpenUnit(false)}>Thoát</Button>
                </div>
              </Fade>
            </Modal>
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
                    <Typography component="h1" variant="h5" color="inherit" noWrap>
                      Nhóm 0{group} - {units.find(x => x.id == unit).name}
                    </Typography>
                    <Paper style={{ paddingBottom: 57 }} className={classes.paper}>
                      <UserSettings unit={unit} type={id1} fcode={code} data={unitMember} />
                      <DialogConfirm openDialog={statusDelete.open} onClick={statusDelete.onClick} onClose={closeDialog} text={`Trưởng Đơn vị đang là ${head.name} (${head.id}), có muốn thay đổi?`} />
                      <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                        <Button variant="contained" style={{ marginRight: 10, width: 200 }} onClick={() => { onAsk() }}>
                          Trưởng đơn vị
                        </Button>
                        <Button variant="contained" color="primary" style={{ marginRight: 10, width: 200 }} onClick={() => { handleOpenAdd() }}>
                          Thêm GV/VC
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => { setShowResults(false) }}>
                          Trở lại trang điều chỉnh
                        </Button>
                      </div>
                    </Paper>
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
                          <h2>Trưởng đơn vị</h2>
                          <form onSubmit={submitHead}>
                            <Autocomplete
                              id="combo-box-demo"
                              options={unitMember}
                              getOptionDisabled={(option) => option[1] == head.id}
                              getOptionLabel={(option) => `${option[0]} (${option[1]})`}
                              fullWidth
                              onChange={(event, value) => value && setHeadTemp({ name: value[0], id: value[1] })}
                              renderInput={(params) => <TextField {...params} label="Trưởng đơn vị" variant="outlined" />}
                            />
                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                              <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >Lưu và thoát</Button>
                              <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleCloseHead}>Thoát</Button>
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
                        <div className={classes.paper1}>
                          <h2>Thêm GV/VC</h2>
                          <form onSubmit={submitAdd}>
                            <TextField onChange={e => setId(e.target.value)} id="id" label="Mã GV/VC" required variant="outlined" className={classes.field} />
                            <IconButton variant='contained' color='primary' onClick={getInfo}>
                              <SearchIcon />
                            </IconButton>
                            <h5 style={{ marginTop: '10px' }}>{display}</h5>
                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                              <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >Thêm</Button>
                              <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleCloseAdd}>Thoát</Button>
                            </div>
                          </form>
                        </div>
                      </Fade>
                    </Modal>
                  </div>
                ) : (
                  <div>
                    <Typography component="h1" variant="h5" color="inherit" noWrap>
                      {name} (Mã biểu mẫu: {code})
                    </Typography>
                    <Paper style={{ padding: 10 }} className={classes.paper}>
                      <MenuEvaluate />
                    </Paper>
                    {stage && <Button style={{width: 80, float: 'right', marginTop: 10 }} variant="contained" onClick={() => { setStage(null) }} ><KeyboardReturnIcon /></Button>}
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