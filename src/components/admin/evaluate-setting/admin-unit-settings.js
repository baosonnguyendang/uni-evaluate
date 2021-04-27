import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Fade from '@material-ui/core/Fade';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
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
    marginBottom: '15px',
    width: '16vw'
  }
}))

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

export default function UnitSettings() {
  const classes = useStyles()

  //open modal them don vi
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    // console.log(chosen)
    setOpen(true);
  };
  const handleClose = () => {
    setChosen(units.filter(unit => unit.check === true))
    setOpen(false);
    units.map(x => {
      console.log(x.check)
    })
  };

  const [chosen, setChosen] = React.useState([])

  const SelectedUnit = () => {
    let bool = false;
    return (
      <div>
        <ol style={{ marginTop: 10 }}>
          {units.map(unit => {
            if (unit.check) {
              bool = true;
              return (
                <li key={unit.id}>{unit.name}</li>
              )
            }
          })}
        </ol>
        {!bool && <p>(Không có đơn vị nào nằm trong nhóm)</p>}
      </div>
    )
  }

  return (
    <div>
      <Typography component="h3" variant="h5" color="inherit">
        Các đơn vị tham gia đánh giá nằm trong nhóm
      </Typography>
      <SelectedUnit/>
      <Button variant="contained" color="primary" className={classes.btn} onClick={handleOpen}>
        Thêm đơn vị vào nhóm
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
            <h4 id="transition-modal-title">Thêm đơn vị vào nhóm</h4>
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={units}
              disableCloseOnSelect
              defaultValue = {chosen}
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
            <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={handleClose}>Xong</Button>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}