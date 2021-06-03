import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
//{open, time, message, severity}
const Toast = ({ toast, handleClose }) => {
  return (
    <>
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={toast.open} autoHideDuration={toast.time} onClose={handleClose}>
        <Alert onClose={handleClose} severity={toast.severity}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Toast
