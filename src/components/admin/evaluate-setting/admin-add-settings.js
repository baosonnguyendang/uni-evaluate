import React, { useState, useEffect } from 'react';

import axios from 'axios';

import SelectCriterion from './admin-select-criterion'
import UserSettings from './admin-user-settings'

import { BrowserRouter as Router, Switch, Route, Redirect, Link, NavLink, useParams, useHistory } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography'
import { useRouteMatch } from 'react-router-dom'

import MUIDataTable from "mui-datatables";

const useStyles = makeStyles(theme => ({
  paper: {
    minHeight: 440,
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
    textTransform: 'none',
    width: '16vw',
    marginBottom: 10
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
  }
}))

var listOfSelection = new Array('')

const createData = (name, id) => {
  return { name, id, check: false }
}
//ds don vi va ma don vi
const units = [
  createData('Khoa Máy tính', '0001'),
  createData('Khoa Cơ khí', '0002'),
  createData('Phòng Đào tạo', '0011'),
  createData('Phòng Y tế', '0012'),
  createData('Ban Giám hiệu', '0020'),
]

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

var unit = ''
var code = ''
var name = ''

export default function AddSettings() {
  const classes = useStyles()
  let { url } = useRouteMatch()
  let { id, id1 } = useParams();
  let history = useHistory();
  //check form da duoc tao hay chua

  //fe to be
  const token = localStorage.getItem('token')

  //khoi tao Form, check form da duoc tao hay chua
  const [init, setInit] = React.useState(0)
  axios.get(`/admin/review/${id}/formtype/${id1}/form/`, { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => {
      console.log(res.data)
      // (res.data) && (setInit(false))
      if (res.data.form) {
        code = res.data.form.code
        name = res.data.form.name
        setInit(2)
      }
      else {
        setInit(1)
      }
    })
    .catch(e => {
      console.log(e)
    })

  const Init = () => {
    const handleSubmitInit = (e) => {
      e.preventDefault()
      setInit(false)
      // console.log(id)
      // console.log(id1)
      // history.push(`${url}/${code}`)
      // console.log(init)
      axios.post(`/admin/review/${id}/formtype/${id1}/form/addForm`, { name: name, code: code }, { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => {
          console.log(res.data)
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
            Khởi tạo Form
          </Typography>
          <form onSubmit={handleSubmitInit} style={{ marginTop: 15 }}>
            <TextField id="code" required onChange={e => setC(e.target.value)} label="Mã Form" variant="outlined" className={classes.field} />
            <br />
            <TextField id="name" required onChange={e => setName(e.target.value)} label="Tên Form" variant="outlined" className={classes.field} />
            <br />
            <Button style={{ marginRight: '10px' }} type="submit" value='submit' variant="contained" color="primary" >Vào cấu hình Form</Button>
          </form>
        </Paper>
      </div>
    )
  }

  //cai nay la de sau khi check hoac uncheck se render lai luon
  const [state, setState] = React.useState(true);

  const group = 1

  //open modal them don vi
  const [openUnit, setOpenUnit] = React.useState(false);
  const handleOpenUnit = () => {
    // console.log(chosen)
    setOpenUnit(true);
  };
  const handleCloseUnit = () => {
    setUnitChosen(units.filter(unit => unit.check === true))
    setOpenUnit(false);
    units.map(x => {
      console.log(x.check)
    })
  };

  const [unitChosen, setUnitChosen] = React.useState([])

  //chuyen sang trang chon nguoi duoc danh gia
  const [showResults, setShowResults] = React.useState(false);

  const SelectedUnit = () => {
    let bool = false;
    let { url } = useRouteMatch();

    const openUnit = (x) => {
      unit = x
      setShowResults(true)
    }

    return (
      <div>
        <ol style={{ marginTop: 10 }}>
          {units.map(unit => {
            if (unit.check) {
              bool = true;
              return (
                <li key={unit.id} id={unit.id} style={{ marginBottom: 10 }} type='button' onClick={() => openUnit(unit.id)}>- {unit.name}</li>
              )
            }
          })}
        </ol>
        {!bool && <p>(Không có đơn vị nào nằm trong nhóm)</p>}
      </div>
    )
  }

  //change tab
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // console.log(newValue)
  };

  //danh sach nguoi trong khoa
  const [unitMember, setUnitMember] = useState([
    ["Joe James", "1712970", "Khoa học máy tính"],
    ["John Walsh", "1712972", "Hệ thống và Mạng"],
    ["James Tarkowski", "1712973", "Hệ thống thông tin"],
    ["James Houston", "1712974", "Công nghệ phần mềm"],
    ["James Rodriguez", "1712975", "Kỹ thuật máy tính"],
    ["James Bond", "1712976", "Công nghệ phần mềm"],
  ])

  //them nguoi rieng le vao danh gia vui
  const [idd, setId] = React.useState('')
  const [openAdd, setOpenAdd] = React.useState(false);
  const handleOpenAdd = () => {
    setOpenAdd(true);
  };
  const handleCloseAdd = () => {
    setOpenAdd(false);
  };
  const submitAdd = (e) => {
    e.preventDefault()
    if (id1 !== '03'){
      setUnitMember(unitMember => [...unitMember, ['null', idd, 'null']])
    } else {
      
    }
    
    handleCloseAdd()
  }
  const [newUnit, setNewUnit] = React.useState('');
  const handleChangeUnit = (event) => {
    setNewUnit(event.target.value); 
  };

  return (
    <div>
      {console.log('code ' + code)}
      {(() => {
        switch (init) {
          case 0:
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
                      <UserSettings data={unitMember} type={ id1 } />
                      <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                        <Button variant="contained" color="primary" style={{ marginRight: 10, width: 235.38 }} onClick={() => { handleOpenAdd() }}>
                          Thêm GV/VC
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => { setShowResults(false) }}>
                          Trở lại trang điều chỉnh
                        </Button>
                      </div>
                    </Paper>
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
                          <form onSubmit={submitAdd()}>
                            <TextField onChange={e => setId(e.target.value)} id="id" label="Mã GV/VC" required variant="outlined" className={classes.field} />
                            <br/>
                            <FormControl variant="outlined" >
                              <InputLabel >Đơn vị</InputLabel>
                              <Select
                                native
                                value={newUnit}
                                label='Đơn vị'
                                onChange={handleChangeUnit}
                              >
                                <option aria-label="None" value="" />
                                <option value={10}>Khoa học máy tính</option>
                                <option value={20}>Hệ thống và Mạng</option>
                                <option value={30}>Hệ thống thông tin</option>
                                <option value={40}>Công nghệ phần mềm</option>
                                <option value={50}>Kỹ thuật máy tính</option>
                              </Select>
                            </FormControl>
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
                      {name} (Mã Form: {code})
                    </Typography>
                    <Paper style={{ padding: 10 }} className={classes.paper}>
                      {/* <AppBar position="static"> */}
                      <Tabs style={{ margin: '-10px 0 10px -10px', height: 36 }} value={value} onChange={handleChange}>
                        <Tab className={classes.tab} label="Cấu hình tiêu chuẩn" />
                        <Tab className={classes.tab} label="Cấu hình đơn vị" />
                      </Tabs>
                      {/* </AppBar> */}
                      {(() => {
                        switch (value) {
                          case 0:
                            return (
                              <div>
                                <SelectCriterion />
                              </div>
                            )
                          case 1:
                            return (
                              <div>
                                <Typography component="h3" variant="h5" color="inherit">
                                  Các đơn vị tham gia đánh giá nằm trong nhóm
                              </Typography>
                                <SelectedUnit />
                                <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpenUnit}>
                                  Thêm đơn vị vào nhóm
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
                                            />
                                            {option.name}
                                          </React.Fragment>
                                        )}
                                        style={{ width: 500 }}
                                        renderInput={(params) => (
                                          <TextField {...params} variant="outlined" label="Đơn vị" placeholder="Đơn vị" />
                                        )}
                                      />
                                      <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={handleCloseUnit}>Xong</Button>
                                    </div>
                                  </Fade>
                                </Modal>
                              </div>
                            )
                        }
                      })()}

                      {/* <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
              Thêm tiêu chuẩn vào Form
            </Button> */}
                    </Paper>
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