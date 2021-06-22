import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Modal, Typography, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import { clearModal } from '../../../actions/modalAction'
import TimesModal from './TimesModal'
import DetailModal from './DetailModal'
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      minWidth: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);



const ModalCustom = () => {
  const classes = useStyles();
  const dispatch = useDispatch()
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const modal = useSelector(state => state.modal)


  const handleClose = () => {
    dispatch(clearModal())
  };


  let body = (
    <form style={modalStyle} className={classes.paper}>
      <Typography variant='h5' >Tiêu chí A</Typography>
      Mỗi lần vi phạm quy chế
      <TextField label='Điểm' />
      <TextField label='Số lần' />
      <TextField label='Tổng' />
      <br />
      <Button onClick={handleClose} variant='contained'>Cancel</Button>
      &nbsp;
      <Button onClick={modal.submit} variant='contained' color='primary'>submit</Button>

    </form>

  );
  switch (modal.type) {
    case 'TIMES_MODAL':
      body = <TimesModal />
      break
    case 'DETAIL_MODAL':
      body = <DetailModal />
      break
    default:

  }
  return (
    <Modal
      open={Boolean(modal.type)}
      onClose={handleClose}
      aria-labelledby='simple-modal-title'
      aria-describedby='simple-modal-description'
    >
      {body}
    </Modal>
  )
}

export default ModalCustom
