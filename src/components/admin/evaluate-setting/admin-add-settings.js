import React, { useState, useEffect } from 'react';

import SelectCriterion from './admin-select-criterion'
import UserSettings from './admin-user-settings'

import { BrowserRouter as Router, Switch, Route, Redirect, Link, NavLink } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

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

export default function AddSettings() {
  const classes = useStyles()
  let { url } = useRouteMatch()

  //khoi tao Form
  const [init, setInit] = React.useState(true)

  const Init = () => {

    const handleSubmitInit = (e) => {
      e.preventDefault()
      setInit(false)
      console.log(init)
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
            <TextField id="code" onChange={e => setC(e.target.value)} label="Mã Form" variant="outlined" className={classes.field} />
            <br />
            <TextField id="name" onChange={e => setName(e.target.value)} label="Tên Form" variant="outlined" className={classes.field} />
            <br />
            <Button style={{ marginRight: '10px' }} type="submit" value='submit' variant="contained" color="primary" >Vào cấu hình Form</Button>
          </form>
        </Paper>
      </div>
    )
  }

  //cai nay la de sau khi check hoac uncheck se render lai luon
  const [state, setState] = React.useState(true);

  //ds vien chuc thuoc don vi duoc chon
  const [usersList, showUsersList] = React.useState([
    { name: 'A', id: '1712970', chosen: true },
    { name: 'AA', id: '1712972', chosen: true },
    { name: 'AAA', id: '1712973', chosen: true },
    { name: 'AIA', id: '1712974', chosen: true },
  ])

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

  return (
    <div>
      {init ? (
        <Init />
      ) : (
        <div>
          {showResults ? (
            <div>
              <Typography component="h1" variant="h5" color="inherit" noWrap>
                Nhóm 0{group} - {units.find(x => x.id == unit).name}
              </Typography>
              <Paper style={{ padding: 10 }} className={classes.paper}>
                {/* <FormGroup>
              {usersList.map(user => {
                return (
                  <FormGroup>
                    <FormControlLabel control={
                      <Checkbox
                        checked={user.chosen}
                        onChange={() => { user.chosen = !user.chosen; setState(!state); console.log(user.name, user.chosen) }}
                        name={user.id}
                        color="primary"
                      />
                    }
                      label={user.id + ' - ' + user.name}
                    />
                  </FormGroup>
                )
              })}
            </FormGroup> */}
                <UserSettings />
                <Typography style={{ position: 'absolute', bottom: 10, right: 10 }} component='button' onClick={() => { setShowResults(false) }}>Trở lại trang điều chỉnh</Typography >
              </Paper>
            </div>
          ) : (
            <div>
              <Typography component="h1" variant="h5" color="inherit" noWrap>
                Nhóm 0{group}
              </Typography>
              <Paper style={{ padding: 10 }} className={classes.paper}>
                {/* <AppBar position="static"> */}
                <Tabs style={{ margin: '-10px 0 10px -10px', height: 36 }} value={value} onChange={handleChange}>
                  <Tab className={classes.tab} label="Item One" />
                  <Tab className={classes.tab} label="Item Two" />
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
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
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
                                <h4 id="transition-modal-title">Thêm đơn vị vào nhóm</h4>
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
      )}
    </div>
  )
}