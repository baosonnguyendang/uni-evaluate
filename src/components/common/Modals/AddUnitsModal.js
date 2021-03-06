import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Button, Typography, TextField, IconButton } from '@material-ui/core';
import { clearModal } from '../../../actions/modalAction'
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
        autocomplete: {
            width: 400
        },
        content: {
            height: 300, overflowY: 'auto'
        }
    }),
);
const Line = ({ data, index, onDelete }) => {
    const classes = useStyles()
    return (<div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <Typography variant='subtitle1' style={{ flexGrow: 1 }}>{data.name}</Typography>
        <IconButton onClick={() => onDelete(index)} ><DeleteIcon /></IconButton>
    </div>)
}


const AddUnitsModal = () => {
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
        handleClose()

    }

    const dataDept = useSelector(state => state.modal.data)
    const [data, setData] = useState([])
    useEffect(() => {
        setData(dataDept)
    }, [dataDept])
    // console.log(dataDept)
    const [deptChosen, setDeptChosen] = useState([])
    const [unitTemp, setUnitTemp] = useState({})
    const addUnitTemp = (data) => {
        setDeptChosen([...deptChosen, data])
        setData(prev => prev.filter(d => d.id !== data.id))
        setUnitTemp({ name: '' })
    }
    const removeUnitTemp = (index) => {
        const temp = deptChosen[index]
        setDeptChosen(deptChosen.filter((d, i) => i !== index))
        setData([...data, temp])
    }
    const filterData = (data) => {
        return { dcodes: data.map(d => d.id) }
    }
    return (
        <>
            <div style={modalStyle} className={classes.paper}>
                <Typography variant='h5' gutterBottom >Th??m ????n v??? tham gia ????nh gi??</Typography>


                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>

                    <Autocomplete
                        loadingText="??ang t???i..."
                        options={data || []}
                        getOptionLabel={(option) => option.name}
                        getOptionSelected={(option, value) => option.name === value.name}
                        id="criteria-select"
                        classes={{
                            option: classes.option,
                        }}
                        className={classes.autocomplete}
                        size='small'
                        autoHighlight
                        onChange={(event, value) => setUnitTemp(value)}
                        value={unitTemp}
                        noOptionsText='Kh??ng t???n t???i'
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Ch???n ????n v???"
                                variant="outlined"
                            />
                        )}
                    />

                    <IconButton
                        aria-label="add"
                        color="primary"
                        onClick={() => addUnitTemp(unitTemp)}
                    >
                        <AddCircleIcon />
                    </IconButton>


                </div>
                <div className={classes.content}>
                    {deptChosen.map((d, i) => <Line data={d} key={d.id} index={i} onDelete={removeUnitTemp} />)}

                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button onClick={handleClose} variant="contained">Tho??t</Button>
                    &nbsp;  &nbsp;
                    <Button type='submit' variant="contained" color="primary" disabled={!deptChosen.length} onClick={() => submit(filterData(deptChosen))}>X??c nh???n</Button>
                </div>
            </div>
        </>
    )
}
export default AddUnitsModal
