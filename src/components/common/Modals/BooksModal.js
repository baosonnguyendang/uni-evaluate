import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Typography, TextField, ListItemText, ListItem, List, IconButton } from '@material-ui/core';
import { clearModal } from '../../../actions/modalAction'
import InputAdornment from '@material-ui/core/InputAdornment';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
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
            marginRight: '10px',
        },
        text: {
            width: 150,
            marginRight: '10px',
        },
        name : {
            width : '100%',
            marginRight: '10px',
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
    return (
        <>
            <form style={modalStyle} className={classes.paper}>
                <Typography variant='h5' >Tiêu chí sách</Typography>

                <div style={{ display: 'flex', alignItems: 'center'}}>
                <Typography gutterBottom variant='subtitle1'style={{flexGrow: 1}} >                    Mỗi cuốn sách đóng góp 5 điểm/cuốn</Typography>

                    {/* <TextField size="small" className={classes.input} type='number' variant="outlined" label="Điểm/lần" disabled defaultValue={point} /> */}
                 
                </div>  
                <div style={{ display: 'flex', alignItems: 'center'}}>
                <TextField size="small" className={classes.name} type='text' variant="outlined" label="Tên sách" onChange={(e) => setTimes(e.target.value)}  />
                {/* <Button variant="contained">Thêm </Button> */}
                <IconButton><AddCircleIcon /></IconButton>
                </div>
                <List  aria-label="main mailbox folders">
                    <ListItem >

                        <ListItemText primary="Drafts" />
                        <TextField size="small" className={classes.input} type='number' variant="outlined" label="Đóng góp" onChange={(e) => setTimes(e.target.value)} defaultValue={0} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
                        <TextField size="small" className={classes.input} type='number' variant="outlined" label="Điểm" disabled onChange={(e) => setTimes(e.target.value)} defaultValue={0} />
                        <TextField size="small" className={classes.text} type='text' variant="outlined" label="Mô tả" />
                        <IconButton><DeleteIcon/></IconButton>
                    </ListItem>
                    <ListItem>
                        <ListItemText style={{ width: '300px' }} primary="Mỗi lần vi phạm quy chế" />
                        <TextField size="small" className={classes.input} type='number' variant="outlined" label="Đóng góp" onChange={(e) => setTimes(e.target.value)} defaultValue={0} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
                        <TextField size="small" className={classes.input} type='number' variant="outlined" label="Điểm" disabled onChange={(e) => setTimes(e.target.value)} defaultValue={point} />
                        <TextField size="small" className={classes.text} type='text' variant="outlined" label="Mô tả" />
                        <IconButton><DeleteIcon/></IconButton>
                    </ListItem>
                </List>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' ,flexDirection: 'column' }}>
                    
                    <Typography style={{marginRight: '10px'}} variant='subtitle1' >Điểm đạt được: 5</Typography>
                    <Typography style={{marginRight: '10px'}} variant='subtitle1' >Điểm tối đa: 10</Typography>
                    
                    <Typography style={{marginRight: '10px'}} variant='subtitle1' >Tổng điểm: 5</Typography>
                
                </div>

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
