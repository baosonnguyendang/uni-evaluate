import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Typography, TextField, Divider, IconButton, Tooltip } from '@material-ui/core';
import { clearModal } from '../../../actions/modalAction'
import InputAdornment from '@material-ui/core/InputAdornment';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HelpIcon from '@material-ui/icons/Help';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${ top }%`,
        left: `${ left }%`,
        transform: `translate(-${ top }%, -${ left }%)`,
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
            width: 250,
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
const Line = ({ name, index, value, description, onDelete, base_point, disableEdit, onChangeName, onChangeDescription, onChangePercent }) => {
    const classes = useStyles()
    // console.log(value * base_point / 100)
    return (<div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <TextField size="small" className={classes.name} type='text' variant="outlined" label="Tên" onChange={(e) => onChangeName(e, index)} disabled={disableEdit} defaultValue={name} />
        <TextField size="small" className={classes.inputpercent} type='number' required variant="outlined" label="Đóng góp" onChange={(e) => onChangePercent(e, index)} disabled={disableEdit} defaultValue={value ?? 0}
            InputProps={{
                inputProps: {
                    max: 100, min: 0
                }, endAdornment: <InputAdornment position="end">%</InputAdornment>
            }} />
        <TextField size="small" className={classes.input} type='number' variant="outlined" label="Điểm" disabled value={value * base_point / 100} />
        <TextField size="small" className={classes.text} type='text' variant="outlined" onChange={(e) => onChangeDescription(e, index)} label="Mô tả" disabled={disableEdit} multiline defaultValue={description ? description : ''} />
        <IconButton onClick={onDelete} disabled={disableEdit}><DeleteIcon /></IconButton>
    </div>)
}
function round(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
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
    const handleSubmit = (e) => {
        e.preventDefault()
        submit(filterData(data))
        handleClose()
    }
    function compareTwoArray(arr1, arr2) {
        return JSON.stringify(arr1) === JSON.stringify(arr2)
    }
    const dataStore = useSelector(state => state.modal.data)
    const [data, setData] = useState(null)
    useEffect(() => {
        setData(dataStore)
        setTempData(dataStore.details)
    }, [dataStore])
    const [value, setValue] = useState(null)
    const [tempData, setTempData] = useState([])
    const addItem = (e) => {
        e.preventDefault()
        if (!value) return
        setData({ ...data, details: [...data.details, value] })
        document.getElementById("form-create-detail").reset();
    }
    const deleteItem = (index) => {
        // console.log(index)
        const temp = data.details.filter((v, i) => i !== index)
        // console.log(temp)
        setData({ ...data, details: temp })
    }
    const filterData = (data) => {
        if (data.details.length === 0) return { point: 0, code: data.code, details: data.details }
        if (!data.max_point) return { point: round(calculate(data.details, 'value', data.base_point)), code: data.code, details: data.details }
        return { point: data.max_point > calculate(data.details, 'value', data.base_point) ? round(calculate(data.details, 'value', data.base_point)) : data.max_point, code: data.code, details: data.details }
    }

    const onChangeName = (e, index) => {
        // console.log(data.details.map((d, i) => (i === index ? { ...d, name: e.target.value } : d)))
        setData({ ...data, details: data.details.map((d, i) => (i === index ? { ...d, name: e.target.value } : d)) })
    }
    const onChangeDescription = (e, index) => {
        setData({ ...data, details: data.details.map((d, i) => (i === index ? { ...d, description: e.target.value } : d)) })
    }
    const onChangePercent = (e, index) => {
        setData({ ...data, details: data.details.map((d, i) => (i === index ? { ...d, value: e.target.value } : d)) })
    }
    // console.log(data)
    if (!data) return null
    const calculate = (data, attr, base_point) => {
        // console.log(data, attr)
        // console.log(data[0][attr])
        let temp = data.reduce((a, d) => a += Number(d[attr]), 0)

        // console.log({ temp: data.reduce((a, d) => a += Number(d[attr]), 0) })
        // data.reduce((a,d) => a+= parseInt(d[attr]), 0)
        return temp / 100 * base_point
    }
    return (
        <>
            <div style={modalStyle} className={classes.paper}>
                <Typography variant='h5' >{data.name}</Typography>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography gutterBottom variant='subtitle1' style={{ flexGrow: 1 }} >{`Mỗi lượt đóng góp tối đa ${ data.base_point } điểm/lượt`}</Typography>
                </div>
                <form onSubmit={addItem} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }} id='form-create-detail'>
                    <TextField disabled={data.disableEdit} size="small" required className={classes.name} type='text' variant="outlined" label="Tên" onChange={(e) => setValue({ ...value, name: e.target.value })} />
                    <TextField disabled={data.disableEdit} size="small" required className={classes.inputpercent} type='number' variant="outlined" label="Đóng góp"
                        InputProps={{
                            inputProps: {
                                max: 100, min: 0
                            }, endAdornment: <InputAdornment position="end">%</InputAdornment>
                        }}
                        onChange={(e) => setValue({ ...value, value: e.target.value })} />

                    <TextField size="small" className={classes.input} type='number' variant="outlined" label="Điểm" disabled value={value?.value * data.base_point / 100 ?? ''} />
                    <TextField disabled={data.disableEdit} size="small" className={classes.text} type='text' variant="outlined" label="Mô tả" onChange={(e) => setValue({ ...value, description: e.target.value })} />
                    <IconButton type='submit' disabled={data.disableEdit}><AddCircleIcon color="primary" /></IconButton>
                </form>
                <Divider />
                <form onSubmit={handleSubmit}>
                    <div style={{ height: '300px', overflowY: "auto" }}>
                        {data.details.map((d, i) => <Line {...d} key={i} index={i} disableEdit={data.disableEdit} base_point={data.base_point} onDelete={() => deleteItem(i)} {...{ onChangeName, onChangeDescription, onChangePercent }} />)}
                    </div>
                    {data.details.length !== 0 &&
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexDirection: 'column' }}>

                            <Typography style={{ marginRight: '10px' }} variant='subtitle1' >Điểm đạt được: {round(calculate(data.details, 'value', data.base_point))}</Typography>
                            {data.max_point ? (<>
                                <Typography style={{ marginRight: '10px' }} variant='subtitle1' >Điểm tối đa: {data.max_point}</Typography>
                                <Typography style={{ marginRight: '10px' }} variant='subtitle1' >Tổng điểm: {data.max_point > calculate(data.details, 'value', data.base_point) ? round(calculate(data.details, 'value', data.base_point)) : data.max_point}</Typography>
                            </>) : <Typography style={{ marginRight: '10px' }} variant='subtitle1' >Tổng điểm: {round(calculate(data.details, 'value', data.base_point))}</Typography>}

                        </div>}

                    <br />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <div style={{ flexGrow: 1 }}>
                            <Tooltip title={
                                <>
                                    <Typography variant='subtitle2'>Điểm đạt được bằng tổng điểm thành phần</Typography>
                                    <Typography variant='subtitle2'>Tổng điểm nhỏ hoặc bằng điểm tối đa</Typography>
                                </>
                            }>
                                <HelpIcon fontSize='small' color='action' />
                            </Tooltip>
                        </div>
                        <Button onClick={handleClose} variant="contained">Thoát</Button>
                        &nbsp;  &nbsp;
                        <Button type='submit' variant="contained" color="primary" disabled={compareTwoArray(data.details, tempData) || data.disableEdit}>Xác nhận</Button>
                    </div>
                </form>


            </div>
        </>
    )
}

export default DetailModal
