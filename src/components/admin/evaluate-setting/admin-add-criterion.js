import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  paper: {
    minHeight: 400,
    padding: 10,
    marginTop: 24,
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
  btn: {
    textTransform: 'none',
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
  }
}))

const criteria = (name, id) => ({ name, id, check: true, selectionList: [], clicked: false })

const createData = (name, id, listOfCriteria) => {
  return { name, id, listOfCriteria, check: false }
}

var listOfSelection = new Array('')

export default function AddCriterion() {
  const classes = useStyles()

  const [data, setData] = React.useState([
    createData('Hoạt động giảng dạy', 'TC001',
      [
        criteria('Định mức giờ chuẩn hoàn thành', '00101'),
        criteria('Kết quả khảo sát chất lượng dịch vụ', '00102'),
      ]
    ),
    createData('Hoạt động khoa học', 'TC002',
      [
        criteria('ab', '00201'),
        criteria('cd', '00202'),
      ]
    ),
  ])

  //open criteria modal
  const [openCriteria, setOpenCriteria] = React.useState(false);
  // const handleOpenCriteria = () => {
  //   setOpenCriteria(true);
  //   setId(criterion.id)
  // }
  const handleCloseCriteria = () => {
    setOpenCriteria(false);
  }

  //open modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //cai nay la de sau khi check hoac uncheck se render lai luon
  const [state, setState] = React.useState(true);

  //cai nay la de khi mo cai chon phan tram thi se biet chon phan tram cho tieu chi nao
  const [criteriaChosen, setCriteriaChosen] = React.useState([])

  //cai nay la de mo cai modal them cac lua chon trong tieu chi a
  const [openPercentage, setOpenPercentage] = React.useState(false)
  const handleOpenPercentage = () => {
    setOpenPercentage(true);
  }

  //dung de luu tieu chuan duoc click vao de chon tieu chi
  const [id, setId] = React.useState()
  const [showCriteria, setShowCriteria] = React.useState([])

  const SelectedCriterion = () => {
    let bool = false
    return (
      <div>
        <ol style={{ marginTop: 10 }}>
          {
            data.map(criterion => {
              // criterion.check ? (<p>{criterion.name}</p>) : ()
              if (criterion.check) {
                bool = true
                return (
                  <li><span style={{ cursor: 'pointer' }} code={criterion.id} component='button' onClick={() => {
                    setOpenCriteria(true);
                    setId(criterion.id);
                    setShowCriteria(criterion.listOfCriteria)
                    // console.log(showCriteria)
                  }}>{criterion.name}</span>
                    <ol>
                      {criterion.listOfCriteria.map(criteria => {
                        return (
                          criteria.check &&
                          <li>
                            <div style={{ cursor: 'pointer', margin: '10px' }} component='button' onClick={() => {
                              handleOpenPercentage();
                              setCriteriaChosen(criteria);
                            }}>{criteria.name}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                              {criteria.selectionList.map(x => {
                                return (
                                  <span style={{ marginRight: '10px', border: '1px solid #f4f4f4' }}>{x}</span>
                                )
                              })}
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
      </div>
    )
  }

  //them cac lua chon vao tieu chi version 2
  const [selection, setSelection] = React.useState(['0'])

  const Input = (props) => {
    const text = {
      style: {
        padding: 6
      }
    }
    return (
      <div>
        <TextField
          variant="outlined" inputProps={text} className={classes.input} placeholder="Thêm lựa chọn vào đây" defaultValue={selection[props.stt]}
          onChange={e => {
            setSelection(selection.map((value, index) => (index == props.stt ? (value = e.target.value) : value)))
          }}
        />
      </div>
    )
  };

  const [inputList, setInputList] = React.useState([]);

  const onAddBtnClick = () => {
    setSelection(selection.push('0'))
    console.log(selection)
    // setInputList(inputList.concat(<Input stt={inputList.length} key={inputList.length} />));
    setInputList(inputList => [...inputList, <Input key={inputList.length} stt={inputList.length} />])
  };

  //cai nay la de luu cac lua chon vao tieu chi version 2
  const error = !inputList.length //phai them it nhat 1 lua chon vao tieu chi
  const handleClosePercentage = () => {
    var listOfSelection = selection.slice(0, inputList.length)
    !listOfSelection.includes('0') && setOpenPercentage(false);
    criteriaChosen.selectionList = listOfSelection
    console.log(criteriaChosen.selectionList)
  }

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        Nhóm 01
      </Typography>
      <Paper className={classes.paper}>
        <Typography component="h3" variant="h5" color="inherit">
          Các tiêu chuẩn và tiêu chí sẽ đánh giá:
        </Typography>
        <SelectedCriterion />
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
                  console.log(value)
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
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openCriteria}
          onClose={handleCloseCriteria}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }} >
          <Fade in={openCriteria}>
            <div className={classes.paper1}>
              <h3 id="transition-modal-title">Thêm tiêu chí vào tiêu chuẩn {id}</h3>
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
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={openPercentage}
          onClose={handleClosePercentage}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openPercentage}>
            <div className={classes.paper1}>
              <h4 id="transition-modal-title">Thêm các lựa chọn cho tiêu chí</h4>
              <div>
                <Button onClick={onAddBtnClick} variant="contained" color="primary" size="small">
                  Thêm lựa chọn
                </Button>
                <Button onClick={!error && handleClosePercentage} variant="contained" color="secondary" style={{ float: 'right' }} size="small">
                  Lưu
                </Button>
                {inputList}
              </div>
            </div>
          </Fade>
        </Modal>
      </Paper>
    </div>
  )
}