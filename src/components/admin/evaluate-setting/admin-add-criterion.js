import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper1: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

const criteria = (name, id) => ({ name, id })

const createData = (name, id, listOfCriteria) => {
  return { name, id, listOfCriteria, check: true }
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

  const test = () => {
    data.map(item => {
      // item.listOfCriteria.map(i => {
      //   console.log(i.name)
      // })
      console.log(item.name)
    })
  }

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

  //check tieu chuan
  const check = () => {

  }
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true,
  });

  const handleChange = (event) => {
    event.target.checked = !event.target.checked
  };

  const submit = e => {
    e.preventDefault()
  }
  //dung de luu tieu chuan duoc click vao de chon tieu chi
  const [id, setId] = React.useState()
  const [showCriteria, setShowCriteria] = React.useState([])

  const SelectedCriterion = () => {
    return (
      <div>
        <ul>
          {
            data.map(criterion => {
              // criterion.check ? (<p>{criterion.name}</p>) : ()
              if (criterion.check) {
                return (<li style={{ cursor: 'pointer' }} code={criterion.id} component='button' onClick={() => {
                  setOpenCriteria(true);
                  setId(criterion.id);
                  setShowCriteria(criterion.listOfCriteria)
                }}>{criterion.name}</li>)
              }
            })
          }
        </ul>
      </div>
    )
  }

  return (
    <div>
      <Paper>
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
              <h3 id="transition-modal-title">Thêm tiêu chuẩn vào Form</h3>
              <FormGroup>
                {data.map(criterion => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={criterion.check}
                        onChange={() => criterion.check = !criterion.check}
                        color="primary"
                      />
                    }
                    label={criterion.name}
                  />
                ))}
              </FormGroup>
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
                    <FormControlLabel control={
                      <Checkbox
                        checked='true'
                        onChange={handleChange}
                        name={criteria.id}
                        color="primary"
                      />
                    }
                      label={criteria.name}
                    />
                  )
                })}
              </FormGroup>
            </div>
          </Fade>
        </Modal>
      </Paper>
    </div>
  )
}