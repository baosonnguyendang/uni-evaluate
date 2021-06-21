import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Typography, TextField, Divider, ListItem, List, IconButton } from '@material-ui/core';
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
        name: {
            flexGrow: 1,
            marginRight: '10px',
        }
    }),
);
const datatest = [{ name: "sách", percent: 0, point: 5, description: "" }, { name: "Báo", percent: 5, point: 5, description: "" }]
const Line = ({ name, percent, point, description, onDelete }) => {
    const classes = useStyles()
    return (<div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <span style={{ flexGrow: 1, width: 300, wordWrap: 'break-word' }}>{name}</span>
        <TextField size="small" className={classes.input} type='number' variant="outlined" label="Đóng góp" disabled defaultValue={ percent ?? 0 } InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
        <TextField size="small" className={classes.input} type='number' variant="outlined" label="Điểm" disabled defaultValue={point} />
        <TextField size="small" className={classes.text} type='text' variant="outlined" label="Mô tả" value={description} />
        <IconButton onClick={onDelete}><DeleteIcon /></IconButton>
    </div>)
}
const DetailModal = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const handleClose = () => {
        dispatch(clearModal())
    };
    const [data, setData] = useState(datatest)
    const modal = useSelector(state => state.modal)
    const [point, setPoint] = useState(5)
    const [times, setTimes] = useState(0)
    const [value , setValue] = useState(null)
    const addBook = (e) => { 
        e.preventDefault()
        if (!value) return 
        setData([...data, value])
    }
    const deleteItem = (index) => {
        console.log(index)
        setData(data.filter((v,i) => i!==index))
    }
    const data1 = useSelector(state => state.modal.data)
    console.log(data1)
    const submit = useSelector(state => state.modal.submit)
    return (
        <>
            <div style={modalStyle} className={classes.paper}>
                <Typography variant='h5' >Tiêu chí sách</Typography>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography gutterBottom variant='subtitle1' style={{ flexGrow: 1 }} >Mỗi cuốn sách đóng góp 5 điểm/cuốn</Typography>

                </div>
                <form  onSubmit={addBook} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <TextField size="small" required className={classes.name} type='text' variant="outlined" label="Tên sách" onChange={(e) => setValue({...value, name: e.target.value})} />
                    <TextField size="small" required className={classes.input} type='number' variant="outlined" label="Đóng góp" defaultValue={0}
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment>}} 
                    onChange={(e) => setValue({...value, percent: e.target.value, point: e.target.value*5/100})}/>

                    <TextField size="small" className={classes.input} type='number' variant="outlined" label="Điểm" disabled value={value?.percent*5/100} />
                    <TextField size="small" className={classes.text} type='text' variant="outlined" label="Mô tả" onChange={(e) => setValue({...value, description: e.target.value})} />
                    <IconButton type='submit'><AddCircleIcon /></IconButton>
                </form>
                <Divider />
                <div style={{maxHeight: '300px', overflowY: "auto"}}>
                {data.map((d,i) => <Line {...d} onDelete={() => deleteItem(i)} />)}
                </div>
                {data.length !== 0 && 
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: 'column' }}>

                    <Typography style={{ marginRight: '10px' }} variant='subtitle1' >Điểm đạt được: 5</Typography>
                    <Typography style={{ marginRight: '10px' }} variant='subtitle1' >Điểm tối đa: 10</Typography>

                    <Typography style={{ marginRight: '10px' }} variant='subtitle1' >Tổng điểm: 5</Typography>

                </div>}

                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button onClick={handleClose} variant="contained">Thoát</Button>
                    &nbsp;  &nbsp;
                    <Button onClick={modal.submit} variant="contained" color="primary" disabled={!data.length}>Xác nhận</Button>
                </div>


            </div>
        </>
    )
}

export default DetailModal
