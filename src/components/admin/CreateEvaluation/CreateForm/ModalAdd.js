

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Loading from '../../../common/Loading'
import DeleteIcon from '@material-ui/icons/Delete';

import { Typography, IconButton, TextField, Button, ListItem, List, ListItemText } from '@material-ui/core';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Modal from '@material-ui/core/Modal';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';

import { useDispatch } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { showSuccessSnackbar, showErrorSnackbar } from '../../../../actions/notifyAction'
//fix out of drag
let portal = document.createElement("div");
document.body.appendChild(portal);
function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${ top }%`,
        left: `${ left }%`,
        transform: `translate(-${ top }%, -${ left }%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        minWidth: '800px',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    option: {
        fontSize: 15,
        '& > span': {
            marginRight: 10,
            fontSize: 18,
        },
    },
    btn: {
        minWidth: '80px',
        marginLeft: '10px'
    }
}));


const ModalAddStandard = ({ open, handleClose, stt, idForm, codeStandard, name, setCriterion }) => {
    const [modalStyle] = React.useState(getModalStyle);
    const dispatch = useDispatch()
    const classes = useStyles();
    // tiêu chí trong tiêu chuẩn
    const [availableCriteria, setAvailableCriteria] = useState(null)
    const [existCriteria, setExistCriteria] = useState([])

    useEffect(() => {
        const getCriteriaOfStandard = (codeStandard) => {

            return axios.get(`/admin/standard/${ codeStandard }/criteria/get`)
                .then(res => {
                    // console.log(res.data)
                    setAvailableCriteria(res.data.criterions)
                })
                .catch(err => {
                    // console.log(err)
                })
        }
        getCriteriaOfStandard(codeStandard)
    }, [codeStandard])
    // tiêu chí đc chon
    const [tempCriteria, setTempCriteria] = useState(null)

    const handleOnDragEnd = (result) => {
        if (!result.destination) return

        const items = Array.from(existCriteria)
        const [reorderItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderItem)
        setExistCriteria(items)
    }
    const deleteCriteria = (i) => {
        setAvailableCriteria([...availableCriteria, existCriteria[i]])
        setExistCriteria(existCriteria.filter((c, index) => index !== i))
    }
    const handleChangePoint = (e, i) => {
        // console.log(e.target.value)
        setExistCriteria(existCriteria.map((c, index) =>
            index === i ? { ...c, point: parseInt(e.target.value) } : c
        ))
    }
    const handleChangePointPerTime = (e, i) => {
        // console.log(e.target.value)
        setExistCriteria(existCriteria.map((c, index) =>
            index === i ? { ...c, base_point: parseInt(e.target.value) } : c
        ))
    }
    const [pointStandard, setPointStandard] = useState('')

    const filterData = (data) => {
        const criterions = data.map((d, index) => ({ criteria_id: d.code, criteria_order: index + 1, criteria_point: d.point, base_point: d.base_point }))
        let temp = {
            standard: {
                standard_id: codeStandard,
                standard_order: stt,
                standard_point: pointStandard,
                criterions
            }
        }
        return temp
    }
    const submitCriterion = (e) => {
        e.preventDefault()
        setLoading(true)
        const data = filterData(existCriteria)
        // console.log(data)
        axios.post(`/admin/form/${ idForm }/addFormStandard/v2`, data)
            .then(res => {
                // console.log(res)
                setLoading(false)
                setCriterion(pointStandard)
                handleClose()
                dispatch(showSuccessSnackbar("Thêm tiêu chuẩn thành công"))
            })
            .catch(error => {
                // console.log(error)
                setLoading(false)
                dispatch(showErrorSnackbar("Thêm tiêu chuẩn thất bại"))
            })
    }
    //loading 
    const [loading, setLoading] = useState(false)

    const body = (
        <div style={modalStyle} className={classes.paper} >
            <Loading open={loading} />
            <Typography variant='h5' gutterBottom >Thêm tiêu chuẩn</Typography>
            <Typography variant='h6' gutterBottom >Tiêu chuẩn</Typography>
            <List>
                <ListItem>
                    <ListItemText style={{ width: '400px' }} primary={`${ codeStandard } - ${ name }`} />
                    <TextField style={{ width: "100px" }} type="number" variant="outlined" autoFocus size="small" label="Điểm"
                        onChange={(e) => setPointStandard(parseInt(e.target.value))}
                    />
                    <IconButton style={{ visibility: 'hidden' }} >
                        <DeleteIcon />
                    </IconButton>
                </ListItem>
            </List>
            <Typography variant='h6' gutterBottom id="simple-modal-title">{`Danh sách tiêu chí`}</Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>

                <Autocomplete
                    loading={!availableCriteria}
                    loadingText="Đang tải..."
                    id="criteria-select"
                    style={{ width: 400, flexGrow: 1 }}
                    options={availableCriteria || []}
                    classes={{
                        option: classes.option,
                    }}
                    size='small'
                    autoHighlight
                    noOptionsText='Không tồn tại'
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) => option.name === value.name}
                    onChange={(event, value) => setTempCriteria(value)}
                    value={tempCriteria}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chọn tiêu chí"
                            variant="outlined"
                        />
                    )}
                />

                <IconButton
                    aria-label="add"
                    color="primary"
                    onClick={() => {
                        if (!tempCriteria) return
                        setExistCriteria([...existCriteria, tempCriteria])
                        setAvailableCriteria(availableCriteria.filter(l => l.code !== tempCriteria.code))
                        setTempCriteria({ name: '' })
                    }}
                >
                    <AddCircleIcon />
                </IconButton>


            </div>
            <form onSubmit={submitCriterion}>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId='criteria'>
                        {(provided) => (
                            <List {...provided.droppableProps} ref={provided.innerRef} style={{ height: 300, overflowY: 'auto' }}>
                                {existCriteria.map((t, index) =>
                                    <Draggable key={t._id} draggableId={t.code} index={index} >
                                        {(provided, snapshot) => (
                                            (snapshot.isDragging) ?
                                                ReactDOM.createPortal(<ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <ListItemText primary={`${ index + 1 }. ${ t.name }`} />

                                                </ListItem>, portal)
                                                : <ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <ListItemText style={{ flexBasis: 0 }} primary={`${ index + 1 }. ${ t.name }`} />
                                                    {(t.type === 'number' || t.type === 'detail') ? (
                                                        <>
                                                            <TextField style={{ width: "100px", marginRight: 10 }} type="number" variant="outlined" autoFocus size="small" label="Điểm"
                                                                onChange={(e) => handleChangePointPerTime(e, index)}
                                                            />
                                                            <TextField style={{ width: "130px" }} type="number" variant="outlined" autoFocus size="small" label="Điểm tối đa"
                                                                onChange={(e) => handleChangePoint(e, index)}
                                                            />
                                                        </>) : (
                                                        <TextField style={{ width: "100px", marginRight: 10 }} type="number" variant="outlined" autoFocus size="small" label="Điểm"
                                                            onChange={(e) => handleChangePoint(e, index)}
                                                        />
                                                    )}
                                                    <IconButton onClick={() => deleteCriteria(index)} >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItem>
                                        )
                                        }
                                    </Draggable>
                                )}
                                {provided.placeholder}
                            </List>
                        )}
                    </Droppable >
                </DragDropContext>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flexGrow: 1 }}>
                    </div>
                    <Button variant="contained" className={classes.btn} onClick={handleClose}>Thoát</Button>
                    <Button variant="contained" color='primary' className={classes.btn} type='submit' disabled={!existCriteria.length} >Lưu</Button>
                </div>
            </form>
        </div >
    );
    return <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
    >
        {body}
    </Modal>
}
export default ModalAddStandard