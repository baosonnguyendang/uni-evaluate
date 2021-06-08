import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

export default function AlertDialog({ openDialog = false, onClick, onClose, text }) {
  return (
    <>
      <Dialog
        open={openDialog}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth={'xs'}
      >
        <DialogTitle id="alert-dialog-title">
          <ErrorOutlineIcon color="secondary" fontSize="large" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text ? text : 'Bạn có thực sự muốn xoá ?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" >
            Huỷ
          </Button>
          <Button onClick={onClick} variant="contained" color="primary" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
