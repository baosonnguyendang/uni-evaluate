import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const Toast = ({open, handleClose, time, message, severity}) => {
    return (
        <>
    <Snackbar open={open} autoHideDuration={time} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
    </Snackbar>
        </>
    )
}

export default Toast
