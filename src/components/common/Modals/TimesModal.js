import React, { useState, useEffect } from 'react'
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
    const submit = useSelector(state => state.modal.submit)
    const dataStore = useSelector(state => state.modal.data)
    const [data, setData] = useState(null)
    const [modalStyle] = React.useState(getModalStyle);
    const handleClose = () => {
        dispatch(clearModal())
    };
    const handleSubmit = (e) => {
        e.preventDefault()
        submit(filterData(data))
        handleClose()
    }
    const filterData = (data) => {
        function round(num) {
            return Math.round((num + Number.EPSILON) * 100) / 100;
        }
        return {point: round(point), code: data.code, details: [{value: times}]}
    }

    useEffect(() => {
        setData(dataStore)
        setPoint(dataStore?.details[0]?.value * dataStore?.base_point)
    }, [dataStore])
    const [point, setPoint] = useState(0)
    const [times, setTimes] = useState('')
    if (!data) return null
    return (
        <>
            <form onSubmit={handleSubmit} style={modalStyle} className={classes.paper}>
                <Typography variant='h5' >Nh???p s??? l???n c??? th???</Typography>

                <ListItem>
                    <ListItemText style={{ width: '300px' }} primary={data.name} />
                    <TextField className={classes.input} type='number' variant="outlined" label="??i???m" disabled defaultValue={data.base_point} />
                    <TextField className={classes.input} type='number' variant="outlined" required label="S??? l???n" 
                    onChange={(e) => {setTimes(e.target.value); setPoint(e.target.value * data.base_point)}} 
                    disabled={data.disableEdit} 
                    defaultValue={data.details[0]?.value}
                    InputProps={{inputProps: { min: 0 }}}
                    />
                    <TextField className={classes.input} type='number' variant="outlined" label="T???ng" disabled value={point}  />
                </ListItem>

                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button onClick={handleClose} variant="contained">Tho??t</Button>
                    &nbsp;  &nbsp;
                    <Button type='submit' variant="contained" color="primary" disabled={data.disableEdit}>X??c nh???n</Button>
                </div>


            </form>
        </>
    )
}

export default TimesModal
