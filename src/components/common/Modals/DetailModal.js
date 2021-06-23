import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Typography, TextField, Divider, IconButton } from '@material-ui/core';
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
            minWidth: 400,
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
            width: 200,
            marginRight: '10px',
        },
        name: {
            width: 290,
            marginRight: '10px',
        },
        inputpercent: {
            width: 160, marginRight: '10px'
        }
    }),
);
const Line = ({ name, value, description, onDelete, base_point, disableEdit }) => {
    const classes = useStyles()
    return (<div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <span style={{ width: 290, wordWrap: 'break-word', marginRight: 10 }}>{name}</span>
        <TextField size="small" className={classes.inputpercent} type='number' variant="outlined" label="Đóng góp" disabled defaultValue={value ?? 0} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
        <TextField size="small" className={classes.input} type='number' variant="outlined" label="Điểm" disabled defaultValue={value * base_point / 100} />
        <TextField size="small" className={classes.text} type='text' variant="outlined" label="Mô tả" value={description ? description : ''} />
        <IconButton onClick={onDelete} disabled={disableEdit}><DeleteIcon /></IconButton>
    </div>)
}
function roundHalf(num) {
    return Math.round(num*2)/2;
}

const DetailModal = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    // getModalStyle is not a pure function, we roll the style only on the first render
    const submit = useSelector(state => state.modal.submit)
    const [modalStyle] = React.useState(getModalStyle);
    const handleClose = () => {
        dispatch(clearModal())
    };
    const handleSubmit = () => {
        submit(filterData(data))
        handleClose()
    }
    const dataStore = useSelector(state => state.modal.data)
    const [data, setData] = useState(null)
    useEffect(() => {
        setData(dataStore)
        const temp = dataStore.details.reduce((a,d) => a += d.value*dataStore.base_point/100, 0)
        setPoint(roundHalf(temp))
    }, [dataStore])
    const [point, setPoint] = useState(0)
    const [value, setValue] = useState(null)
    const addItem = (e) => {
        e.preventDefault()
        if (!value) return
        setData({ ...data, details: [...data.details, value] })
        setPoint(prev => prev + value.value * data.base_point / 100)
    }
    const deleteItem = (index) => {
        console.log(index)
        setPoint(prev => prev - data.details[index].value*data.base_point/100)
        const temp = data.details.filter((v, i) => i !== index)
        console.log(temp)
        setData({ ...data, details: temp })
    }
    const filterData = (data) => {
        return {point: data.max_point > roundHalf(point) ? point : data.max_point, code: data.code, details: data.details}
    }
    
    if (!data) return null
    const dataSend = filterData(data)
    console.log(dataSend)
    return (
        <>
            <div style={modalStyle} className={classes.paper}>
                <Typography variant='h5' >{data.name}</Typography>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography gutterBottom variant='subtitle1' style={{ flexGrow: 1 }} >{`Mỗi lượt đóng góp tối đa ${data.base_point} điểm/lượt`}</Typography>
                </div>
                <form onSubmit={addItem} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <TextField size="small" required className={classes.name} type='text' variant="outlined" label="Tên sách" onChange={(e) => setValue({ ...value, name: e.target.value })} />
                    <TextField size="small" required className={classes.inputpercent} type='number' variant="outlined" label="Đóng góp" 
                        InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        onChange={(e) => setValue({ ...value, value: e.target.value })} />

                    <TextField size="small" className={classes.input} type='number' variant="outlined" label="Điểm" disabled value={value?.value * data.base_point / 100} />
                    <TextField size="small" className={classes.text} type='text' variant="outlined" label="Mô tả" onChange={(e) => setValue({ ...value, description: e.target.value })} />
                    <IconButton type='submit' disabled={data.disableEdit}><AddCircleIcon color="primary" /></IconButton>
                </form>
                <Divider />
                <div style={{ maxHeight: '300px', overflowY: "auto" }}>
                    {data.details.map((d, i) => <Line {...d} key={i} disableEdit={data.disableEdit} base_point={data.base_point} onDelete={() => deleteItem(i)} />)}
                </div>
                {data.details.length !== 0 &&
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: 'column' }}>

                        <Typography style={{ marginRight: '10px' }} variant='subtitle1' >Điểm đạt được: {point}</Typography>
                        {data.max_point ? (<>
                            <Typography style={{ marginRight: '10px' }} variant='subtitle1' >Điểm tối đa: {data.max_point}</Typography>
                            <Typography style={{ marginRight: '10px' }} variant='subtitle1' >Tổng điểm: {data.max_point > point ? roundHalf(point) : data.max_point}</Typography>
                        </>) : <Typography style={{ marginRight: '10px' }} variant='subtitle1' >Tổng điểm: {roundHalf(point)}</Typography>}

                    </div>}

                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button onClick={handleClose} variant="contained">Thoát</Button>
                    &nbsp;  &nbsp;
                    <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!data.details.length || data.disableEdit}>Xác nhận</Button>
                </div>


            </div>
        </>
    )
}

export default DetailModal
