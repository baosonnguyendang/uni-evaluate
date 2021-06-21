import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Typography, TextField, ListItemText, ListItem, } from '@material-ui/core';
import { clearModal } from '../../../actions/modalAction'

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
            // width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
        input: {
            width: 100,
            marginLeft: '10px'
        }
    }),
);

const TimesModal = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const handleClose = () => {
        dispatch(clearModal())
    };
    const modal = useSelector(state => state.modal)
    const [point, setPoint] = useState(5)
    const [times, setTimes] = useState(0)
    const [rows, setRows] = useState([])
    const [previous, setPrevious] = useState([])
    return (
        <>
            <form style={modalStyle} className={classes.paper}>
                <Typography variant='h5' >Nhập số lần</Typography>

                <ListItem>
                    <ListItemText style={{ width: '300px' }} primary="Mỗi lần vi phạm quy chế" />
                    <TextField className={classes.input} type='number' variant="outlined" label="Điểm" disabled defaultValue={point} />
                    <TextField className={classes.input} type='number' variant="outlined" label="Số lần" onChange={(e) => setTimes(e.target.value)} />
                    <TextField className={classes.input} type='number' variant="outlined" label="Tổng" disabled value={point * times} defaultValue={0} />
                </ListItem>

                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button onClick={handleClose} variant="contained">Thoát</Button>
                    &nbsp;  &nbsp;
                    <Button onClick={modal.submit} variant="contained" color="primary">Xác nhận</Button>
                </div>


            </form>
        </>
    )
}

export default TimesModal
