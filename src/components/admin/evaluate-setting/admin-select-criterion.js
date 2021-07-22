import React, { useState, useEffect } from 'react';

import axios from 'axios';


import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

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
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minHeight: 250,
  },
  paper2: {
    padding: theme.spacing(2, 4, 3),
  },
  btn: {
    textTransform: 'none',
    width: '16vw',
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
}))

const criteria = (name, id) => ({ name, id, check: true, clicked: false })

const createData = (name, id, listOfCriteria) => {
  return { name, id, listOfCriteria, check: false, order: null }
}

export default function SelectCriterion() {
  const classes = useStyles()

  const [compare, setCompare] = React.useState([])

  const [data, setData] = React.useState([
    // createData('Hoạt động giảng dạy', 'TC001',
    //   [
    //     criteria('Định mức giờ chuẩn hoàn thành', '00101'),
    //     criteria('Kết quả khảo sát chất lượng dịch vụ', '00102'),
    //   ]
    // ),
    // createData('Hoạt động khoa học', 'TC002',
    //   [
    //     criteria('ab', '00201'),
    //     criteria('cd', '00202'),
    //   ]
    // ),
  ])

  //fe to be
  const token = localStorage.getItem('token')
  const fetchCriterion = () => {
    axios.get('admin/standard/criteria', { headers: { "Authorization": `Bearer ${ token }` } })
      .then(res => {
        res.data.standards.map(x => {
          setData(data => [...data, createData(x.name, x.code, x.criteria.map(y => { return (criteria(y.name, y.code)) }))])
        })
      })
      .catch(e => {
        console.log(e)
      })
  }

  //open criteria modal
  const [openCriteria, setOpenCriteria] = React.useState(false);
  const handleCloseCriteria = () => {
    setOpenCriteria(false);
    // console.log(data.map(x => x.order))
  }

  //open modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    if (data.length == 0) {
      fetchCriterion();
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  //cai nay la de sau khi check hoac uncheck se render lai luon
  const [state, setState] = React.useState(true);

  //dung de luu tieu chuan duoc click vao de chon tieu chi
  const [id, setId] = React.useState()
  const [showCriteria, setShowCriteria] = React.useState([])

  //change tab
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // console.log(newValue)
  };

  //cau hinh chung tieu chuan
  const [point, setP] = React.useState('')
  const submitOrder = e => {
    e.preventDefault()
    // data.find(x => x.id === id).order = order
    // console.log(new Set(compare).size !== compare.length)
  }

  //chon don vi trong modal
  const [order, setOrder] = React.useState('');
  const handleChangeOrder = (event) => {
    setOrder(event.target.value);
    data.find(x => x.id === id).order = event.target.value
    setCompare(data.map(x => x.order).filter(y => y !== null))
    // console.log(data.map(x => x.order))
  };

  let bool = false

  return (
    <div>
      <Typography component="h3" variant="h5" color="inherit">
        Các tiêu chuẩn và tiêu chí sẽ đánh giá:
      </Typography>
      <ol style={{ marginTop: 10 }}>
        {
          data.map(criterion => {
            // criterion.check ? (<p>{criterion.name}</p>) : ()
            if (criterion.check) {
              bool = true
              return (
                <li><span style={{ cursor: 'pointer' }} code={criterion.id} component='button' onClick={() => {
                  setOpenCriteria(true);
                  setId(criterion.id)
                  setOrder(criterion.order)
                  setShowCriteria(criterion.listOfCriteria)
                  // console.log(showCriteria)
                }}>{criterion.name}</span>
                  <ol>
                    {criterion.listOfCriteria.map(criteria => {
                      return (
                        criteria.check &&
                        <li>
                          <div style={{ margin: '10px' }}>{criteria.name}
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                </li>
              )
            }
          })
        }
      </ol>
      {!bool && <p>(Chưa có tiêu chuẩn nào được thêm cả)</p>}
      <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
        Thêm tiêu chuẩn vào Form
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
            <h4 id="transition-modal-title">Thêm tiêu chuẩn</h4>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={data}
              getOptionLabel={(data) => data.name}
              defaultValue={data.filter(x => x.check === true)}
              onChange={(event, value) => {
                // console.log(value)
                data.map(criterion => criterion.check = false)
                value.map(criterion => criterion.check = true)
              }}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Danh sách tiêu chuẩn được chọn"
                  placeholder="Tiêu chuẩn"
                />
              )}
            />
            <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={handleClose}>Xong</Button>
          </div>
        </Fade>
      </Modal>
      <Modal
        className={classes.modal}
        open={openCriteria}
        onClose={handleCloseCriteria}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }} >
        <Fade in={openCriteria}>
          <div className={classes.paper1} style={{ padding: 0 }}>
            <AppBar position="static" style={{ marginBottom: 10 }}>
              <Tabs variant="fullWidth" value={value} onChange={handleChange}>
                <Tab className={classes.tab} label="Cấu hình chung" />
                <Tab className={classes.tab} label="Thêm tiêu chí" />
              </Tabs>
            </AppBar>
            {/* <h3 id="transition-modal-title">Thêm tiêu chí vào tiêu chuẩn {id}</h3> */}
            {(() => {
              switch (value) {
                case 0:
                  return (
                    <div className={classes.paper2}>
                      <form onSubmit={submitOrder}>
                        <FormControl variant="outlined" fullWidth style={{ marginBottom: 10 }}>
                          <InputLabel htmlFor="outlined-newUnit-native">STT trong Form</InputLabel>
                          <Select
                            native
                            required
                            value={order}
                            label='STT trong Form'
                            onChange={handleChangeOrder}
                            error={new Set(compare).size !== compare.length}
                          >
                            <option aria-label="None" value="" />
                            {data.filter(x => x.check === true).map((x, index) => {
                              return (
                                <option value={index + 1}>{index + 1}</option>
                              )
                            })}
                          </Select>
                          <FormHelperText>{new Set(compare).size !== compare.length && 'Trùng STT với tiêu chuẩn khác, vui lòng kiểm tra lại'}</FormHelperText>
                        </FormControl>
                        <TextField error={point === ""} helperText={point === "" ? 'Empty field!' : ' '} onChange={e => setP(e.target.value)} type='number' id="point" label="Tổng điểm" variant="outlined" fullWidth />
                        {/* <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >Lưu</Button> */}
                        <Button style={{ marginLeft: '10px', marginTop: '10px' }} variant="contained" color="primary" onClick={handleCloseCriteria}>Thoát</Button>
                      </form>
                    </div>
                  )
                case 1:
                  return (
                    <div className={classes.paper2}>
                      {showCriteria.map(criteria => {
                        <p>{criteria.id}</p>
                      })}
                      <FormGroup>
                        {showCriteria.map(criteria => {
                          return (
                            // <p>{criteria.id}</p>
                            <FormGroup>
                              <FormControlLabel control={
                                <Checkbox
                                  checked={criteria.check}
                                  onChange={() => { criteria.check = !criteria.check; setState(!state) }}
                                  name={criteria.id}
                                  color="primary"
                                />
                              }
                                label={criteria.name}
                              />
                            </FormGroup>
                          )
                        })}
                      </FormGroup>
                      <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleCloseCriteria}>Xong</Button>
                    </div>
                  )
                default:
                  return null
              }
            })()}
          </div>
        </Fade>
      </Modal>
    </div>
  )
}
