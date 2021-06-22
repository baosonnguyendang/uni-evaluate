import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Modal, Typography, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import { clearModal } from '../../../actions/modalAction'
import TimesModal from './TimesModal'
import DetailModal from './DetailModal'

const ModalCustom = () => {
  const dispatch = useDispatch()
  // getModalStyle is not a pure function, we roll the style only on the first render
  const modal = useSelector(state => state.modal)


  const handleClose = () => {
    dispatch(clearModal())
  };

  const SwitchModal = ({ type }) => {
    console.log(type)
    switch (type) {
      case 'TIMES_MODAL':
        return <TimesModal />
      case 'DETAIL_MODAL':
        return <DetailModal />
      default:
        return null
    }
  }

  return (
    <Modal
      open={Boolean(modal.type)}
      onClose={handleClose}
      aria-labelledby='simple-modal-title'
      aria-describedby='simple-modal-description'
    >
      <SwitchModal type={modal.type} />
    </Modal>
  )
}

export default ModalCustom
