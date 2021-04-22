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

const criteria = (name, id) => ({ name, id, check: true, percentage: [], clicked: false })

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

  //cai nay la de khi mo cai chon phan tram thi se biet chon phan tram cho tieu chi nao
  const [criteriaChosen, setCriteriaChosen] = React.useState([])

  //cai nay la de mo cai modal chon phan tram tieu chi a
  const [openPercentage, setOpenPercentage] = React.useState(false)
  const handleOpenPercentage = () => {
    setOpenPercentage(true);
  }
  const handleClosePercentage = () => {
    setOpenPercentage(false);
    console.log(criteriaChosen.percentage)
    criteriaChosen.percentage = []
    Object.values(percentageState).forEach((x, index) => x === true ? (criteriaChosen.percentage.push(10 * (index + 1))) : null)
  }

  //cai nay la de check tung gia tri trong tieu chi
  const [percentageState, setPercentageState] = React.useState({
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
    i: false,
  });
  const handleChangePercentage = (event) => {
    setPercentageState({ ...percentageState, [event.target.name]: event.target.checked });
  };
  const { a, b, c, d, e, f, g, h, i } = percentageState;
  const error = [a, b, c, d, e, f, g, h, i].filter((v) => v).length < 1;

  //cai nay la de lay cai phan tram cua tieu chi neu da duoc check it nhat 1 lan
  const setPercentage = (criteria) => {
    percentageState.a = false;
    percentageState.b = false;
    percentageState.c = false;
    percentageState.d = false;
    percentageState.e = false;
    percentageState.f = false;
    percentageState.g = false;
    percentageState.h = false;
    percentageState.i = false;
    if (criteria.clicked == true) {
      criteria.percentage.map(x => {
        switch (x) {
          case 10:
            percentageState.a = true;
            break;
          case 20:
            percentageState.b = true;
            break;
          case 30:
            percentageState.c = true;
            break;
          case 40:
            percentageState.d = true;
            break;
          case 50:
            percentageState.e = true;
            break;
          case 60:
            percentageState.f = true;
            break;
          case 70:
            percentageState.g = true;
            break;
          case 80:
            percentageState.h = true;
            break;
          case 90:
            percentageState.i = true;
            break;
        }
      })
    } else {
      // for (var x in percentageState) {
      //   x = false;
      // }
      criteria.clicked = true;
    }
  }

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
                              setPercentage(criteria);
                            }}>{criteria.name}
                            </div>
                            <div style={{marginBottom: '10px'}}>
                              {criteria.percentage.map(x => {
                                return (
                                  <span style={{ marginRight: '10px', padding: '5px', border: '1px solid #f4f4f4' }}>{x}%</span>
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
              <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={!error && handleCloseCriteria}>Xong</Button>
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
              <h4 id="transition-modal-title">Chọn các mốc</h4>
              <FormGroup>
                <FormControl required error={error} component="fieldset" className={classes.formControl}>
                  <FormGroup style={{ display: 'inline' }}>
                    <FormControlLabel
                      control={<Checkbox checked={a} onChange={handleChangePercentage} name="a" />}
                      label="10%"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={b} onChange={handleChangePercentage} name="b" />}
                      label="20%"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={c} onChange={handleChangePercentage} name="c" />}
                      label="30%"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={d} onChange={handleChangePercentage} name="d" />}
                      label="40%"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={e} onChange={handleChangePercentage} name="e" />}
                      label="50%"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={f} onChange={handleChangePercentage} name="f" />}
                      label="60%"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={g} onChange={handleChangePercentage} name="g" />}
                      label="70%"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={h} onChange={handleChangePercentage} name="h" />}
                      label="80%"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={i} onChange={handleChangePercentage} name="i" />}
                      label="90%"
                    />
                  </FormGroup>
                  {error && <FormHelperText>Chọn ít nhất 1 cái nha để còn phân loại</FormHelperText>}
                </FormControl>
              </FormGroup>
              <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={!error && handleClosePercentage}>Xong</Button>
            </div>
          </Fade>
        </Modal>
      </Paper>
    </div>
  )
}