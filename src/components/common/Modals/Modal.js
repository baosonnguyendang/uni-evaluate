import React from 'react';

import { Modal } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import { clearModal } from '../../../actions/modalAction'
import TimesModal from './TimesModal'
import DetailModal from './DetailModal'
import AddUnitsModal from './AddUnitsModal'

const ModalCustom = () => {
  const dispatch = useDispatch()
  const modal = useSelector(state => state.modal)


  const handleClose = () => {
    dispatch(clearModal())
  };

  const SwitchModal = ({ type }) => {
    // console.log(type)
    switch (type) {
      case 'TIMES_MODAL':
        return <TimesModal />
      case 'DETAIL_MODAL':
        return <DetailModal />
      case 'ADD_UNIT_MODAL':
        return <AddUnitsModal />
      default:
        return <></>
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
