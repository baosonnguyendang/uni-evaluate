import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

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
  },
  formControl: {
    margin: theme.spacing(3),
    marginTop: 0,
    marginBottom: 0,
  },
}))

const criteria = (name, id) => ({ name, id, check: true })

const createData = (name, id, listOfCriteria) => {
  return { name, id, listOfCriteria, check: false }
}

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

  //cai nay la de check tung gia tri trong tieu chi
  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter((v) => v).length < 1;
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const submit = e => {
    e.preventDefault()
  }
  //dung de luu tieu chuan duoc click vao de chon tieu chi
  const [id, setId] = React.useState()
  const [showCriteria, setShowCriteria] = React.useState([])

  const SelectedCriterion = () => {
    let bool = false
    return (
      <div>
        <ul style={{ marginTop: 10 }}>
          {
            data.map(criterion => {
              // criterion.check ? (<p>{criterion.name}</p>) : ()
              if (criterion.check) {
                bool = true
                return (<li style={{ cursor: 'pointer' }} code={criterion.id} component='button' onClick={() => {
                  setOpenCriteria(true);
                  setId(criterion.id);
                  setShowCriteria(criterion.listOfCriteria)
                }}>{criterion.name}</li>)
              }
            })
          }
        </ul>
        {!bool && <p>(Chưa có tiêu chuẩn nào được thêm cả)</p>}
      </div>
    )
  }

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        Nhóm 01
      </Typography>
      <Paper className={classes.paper}>
        <Typography component="h3" variant="h5" color="inherit">
          Các tiêu chuẩn sẽ đánh giá:
        </Typography>
        <SelectedCriterion />
        <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
          Danh sách bộ tiêu chuẩn
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
              <h4 id="transition-modal-title">Danh sách bộ tiêu chuẩn</h4>
              <FormGroup>
                {data.map(criterion => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={criterion.check}
                        onChange={() => { criterion.check = !criterion.check; setState(!state) }}
                        color="primary"
                      />
                    }
                    label={criterion.name}
                  />
                ))}
              </FormGroup>
              <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Xong</Button>
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
                {console.log(showCriteria)}
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
                      {
                        criteria.check &&
                        <FormControl required error={error} component="fieldset" className={classes.formControl}>
                          {/* <FormLabel component="legend">Chọn ít nhất 1 cái nha để còn phân loại</FormLabel> */}
                          <FormGroup style={{display:'inline'}}>
                            <FormControlLabel 
                              control={<Checkbox checked={jason} onChange={handleChange} name="jason" />}
                              label="10%"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={antoine} onChange={handleChange} name="antoine" />}
                              label="20%"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={antoine} onChange={handleChange} name="gilad" />}
                              label="30%"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={antoine} onChange={handleChange} name="antoine" />}
                              label="40%"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={antoine} onChange={handleChange} name="antoine" />}
                              label="50%"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={antoine} onChange={handleChange} name="antoine" />}
                              label="60%"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={antoine} onChange={handleChange} name="antoine" />}
                              label="70%"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={antoine} onChange={handleChange} name="antoine" />}
                              label="80%"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={antoine} onChange={handleChange} name="antoine" />}
                              label="90%"
                            />
                          </FormGroup>
                          {error && <FormHelperText>Chọn ít nhất 1 cái nha để còn phân loại</FormHelperText>}
                        </FormControl>
                      }
                    </FormGroup>
                  )
                })}
              </FormGroup>
              <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={!error && handleCloseCriteria}>Xong</Button>
            </div>
          </Fade>
        </Modal>
      </Paper>
    </div>
  )
}