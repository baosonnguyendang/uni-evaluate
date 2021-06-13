import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { useDispatch, useSelector } from "react-redux";
import { clearSnackbar } from '../../actions/notifyAction'
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
//{open, time, message, severity}
const Toast = () => {
    const dispatch = useDispatch();
    const { open, type, message } = useSelector(
        state => state.notify
    );
    function handleClose() {
        dispatch(clearSnackbar());
    }
    return (
        <>
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={type}>
                    {message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Toast
