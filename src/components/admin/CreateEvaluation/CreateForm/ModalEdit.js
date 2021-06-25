import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Loading from '../../../common/Loading'
import RestoreIcon from '@material-ui/icons/Restore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import BlockIcon from '@material-ui/icons/Block';
import { Typography, IconButton, TextField, Button, ListItem, List, ListItemText, Tooltip } from '@material-ui/core';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Modal from '@material-ui/core/Modal';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../../actions/notifyAction'
import Autocomplete from '@material-ui/lab/Autocomplete';
//fix out of drag
let portal = document.createElement("div");
document.body.appendChild(portal);
function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: '900px',
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

// listCriteria là standard chứa criteria
const ModalEditStandard = ({ open, handleClose, idForm, codeStandard, name }) => {
    const dispatch = useDispatch()
    const [modalStyle] = React.useState(getModalStyle);
    const classes = useStyles();
    const [isEdit, setIsEdit] = useState(false)
    // tiêu chí trong tiêu chuẩn
    const [availableCriteria, setAvailableCriteria] = useState(null)
    const [existCriteria, setExistCriteria] = useState([])
    const [temp, setTemp] = useState({ existCriteria: [], availableCriteria: [] })
    const getFormCriteria = (idForm, codeStandard) => {
        return axios.get(`/admin/form/${idForm}/standard/${codeStandard}/getFormCriteria`)
            .then(res => {
                console.log(res.data)
                setExistCriteria(res.data.formCriteria.map(c => ({ ...c, ...c.criteria_id })))
                return res.data.formCriteria.map(c => ({ ...c, ...c.criteria_id }))
            })
            .catch(err => {
                setExistCriteria([])
                console.log(err)
            })
    }
    const getCriteriaOfStandard = (codeStandard) => {
        return axios.get(`/admin/standard/${codeStandard}/criteria/get`)
            .then(res => {
                console.log(res.data)
                return res.data.criterions
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        Promise.all([getFormCriteria(idForm, codeStandard), getCriteriaOfStandard(codeStandard)])
            .then(([existCriteria, criterions]) => {
                if (existCriteria) {
                    const listExistCriteria = existCriteria.map(c => c.code)
                    const availableCriteria = criterions.filter(c => !listExistCriteria.includes(c.code))
                    setAvailableCriteria(availableCriteria)
                    setTemp({ existCriteria, availableCriteria })
                }
                else {
                    setAvailableCriteria(criterions)
                }
            })

    }, [codeStandard])
    // tiêu chí đc chon
    const [tempCriteria, setTempCriteria] = useState(null)

    // diem cua tieu chi them moi
    const [pointNewCriteria, setPointNewCriteria] = React.useState('')
    // điểm 1 lần của tiêu chí
    const [basePoint, setBasePoint] = useState('')
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
        console.log(e.target.value)

        setExistCriteria(existCriteria.map((c, index) =>
            index === i ? { ...c, point: parseInt(e.target.value) } : c
        ))
    }
    const handleChangeBasePoint =(e, i) => {
        console.log(e.target.value)

        setExistCriteria(existCriteria.map((c, index) =>
            index === i ? { ...c, base_point: parseInt(e.target.value) } : c
        ))
    }

    const filterCriteria = data => {
        return {
            criterions:
                data.map((d, index) => ({ criteria_id: d.code, criteria_order: index + 1, criteria_point: d.point, base_point: d.base_point }))
        }
    }
    const submitEditCriteria = () => {
        const data = filterCriteria(existCriteria)
        console.log(data)
        setLoading(true)
        axios.post(`/admin/form/${idForm}/standard/${codeStandard}/editFormCriteria`, data)
            .then(res => {
                console.log(res.data)
                setTemp({ existCriteria, availableCriteria })
                setLoading(false)
                dispatch(showSuccessSnackbar("Cập nhật tiêu chí thành công"))
            })
            .catch(error => {
                console.log(error)
                setLoading(false)
                dispatch(showErrorSnackbar("Cập nhật tiêu chí thất bại"))
            })
    }
    const restore = () => {
        setAvailableCriteria(temp.availableCriteria)
        setExistCriteria(temp.existCriteria)
    }
    //loading 
    const [loading, setLoading] = useState(false)
    const addCriteria = () => {
        if (tempCriteria.name === '') return
        setLoading(true)

        const data = {
            criteria: {  //body
                criteria_id: tempCriteria.code,
                criteria_order: temp.existCriteria.length + 1,// luu trong restore
                criteria_point: pointNewCriteria,
                base_point: basePoint
            }
        }

        axios.post(`/admin/form/${idForm}/standard/${codeStandard}/addSingleFormCriteria`, data)
            .then(res => {
                console.log(res.data)
                const newExistCriteria = [...existCriteria, { ...tempCriteria, point: pointNewCriteria, base_point: basePoint }]
                const newEsetAvailableCriteria = availableCriteria.filter(l => l.code !== tempCriteria.code)
                setExistCriteria(newExistCriteria)
                setAvailableCriteria(newEsetAvailableCriteria)
                setTemp({ existCriteria: newExistCriteria, availableCriteria: newEsetAvailableCriteria })
                setTempCriteria({ name: '' })
                setPointNewCriteria('')
                setLoading(false)
                dispatch(showSuccessSnackbar("Thêm tiêu chí mới thành công"))
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
                dispatch(showErrorSnackbar("Thêm tiêu chí mới thất bại"))
            })
    }
    console.log(existCriteria)
    const body = (
        <div style={modalStyle} className={classes.paper} >
            <Loading open={loading} />
            <Typography variant='h5' gutterBottom id="simple-modal-title">{`Cập nhật tiêu chuẩn - ${name}`}</Typography>
            <Typography variant='h6' >{`Thêm tiêu chí`}</Typography>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Autocomplete
                    loading={!availableCriteria}
                    loadingText="Đang tải..."
                    id="criteria-select"
                    style={{ width: 400, flexGrow: 1 }}
                    options={availableCriteria || []}
                    classes={{
                        option: classes.option,
                    }}
                    autoHighlight
                    noOptionsText='Không tồn tại'
                    getOptionLabel={(option) => option.name}
                    getOptionDisabled={(option) => !temp.availableCriteria.includes(option)}
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
                {!(tempCriteria?.type === 'number' || tempCriteria?.type === 'detail') ? (
                    <TextField style={{ width: "100px", marginLeft: '20px', marginRight: '10px' }} type="number" variant="outlined" autoFocus size="small" label="Điểm"
                        value={pointNewCriteria} onChange={(e) => setPointNewCriteria(parseInt(e.target.value))}
                    />
                ) : (
                    <>
                        <TextField required style={{ width: "110px", marginLeft: '20px', marginRight: '10px' }} type="number" variant="outlined" autoFocus size="small" label="Điểm/lần"
                            value={basePoint} onChange={(e) => setBasePoint(parseInt(e.target.value))}
                        />
                        <TextField style={{ width: "140px", marginRight: '10px' }} type="number" variant="outlined" autoFocus size="small" label="Điểm tối đa"
                            value={pointNewCriteria} onChange={(e) => setPointNewCriteria(parseInt(e.target.value))}
                        />
                    </>
                )}

                <IconButton
                    aria-label="add"
                    color="primary"
                    edge='end'
                    onClick={addCriteria}
                >
                    <AddCircleIcon />
                </IconButton>

            </div>
            <Typography variant='h6' gutterBottom>Danh sách tiêu chí</Typography>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId='criteria'>
                    {(provided) => (
                        <List {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: '300px' }}>
                            {existCriteria.map((t, index) =>
                                <Draggable key={t._id} draggableId={t.code} index={index} isDragDisabled={!isEdit} >
                                    {(provided, snapshot) => (
                                        (snapshot.isDragging) ?
                                            ReactDOM.createPortal(<ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                <ListItemText primary={`${index + 1}. ${t.name}`} />
                                            </ListItem>, portal)
                                            : <Tooltip title={
                                                t.description && <Typography variant='subtitle2'>{t.description}</Typography>
                                            }> 
                                            <ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                <ListItemText style={{ width: '400px' }} primary={`${index + 1}. ${t.name}`} />
                                                {(t.type === 'number' || t.type === 'detail') ? (
                                                    <>
                                                        <TextField style={{ width: "110px",}} type="number" variant="outlined" autoFocus size="small" label="Điểm/lần"
                                                            onChange={(e) => handleChangeBasePoint(e, index)}
                                                            defaultValue={t.base_point}
                                                            disabled={!isEdit}
                                                        />
                                                        <TextField style={{ width: "140px", marginLeft: '10px' }} type="number" variant="outlined" size="small" label="Điểm tối đa"
                                                            onChange={(e) => handleChangePoint(e, index)}
                                                            defaultValue={t.point}
                                                            disabled={!isEdit}
                                                        />
                                                    </>
                                                ) :
                                                    (<TextField style={{ width: "100px" }} type="number" variant="outlined" autoFocus size="small" label="Điểm"
                                                        onChange={(e) => handleChangePoint(e, index)}
                                                        defaultValue={t.point}
                                                        disabled={!isEdit}
                                                    />)}


                                                <IconButton style={{ visibility: isEdit ? 'visible' : 'hidden' }} onClick={() => deleteCriteria(index)} >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItem>
                                            </Tooltip>
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
                    {!isEdit ? <IconButton
                        aria-label="return"
                        color="primary"
                        onClick={() => setIsEdit(!isEdit)}
                    >
                        <EditIcon />
                    </IconButton>
                        :
                        <>
                            <IconButton
                                aria-label="return"
                                color="primary"
                                onClick={() => setIsEdit(!isEdit)}
                            >
                                <BlockIcon />
                            </IconButton>
                            <IconButton
                                aria-label="restore"
                                color="primary"
                                onClick={restore}
                            >
                                <RestoreIcon />
                            </IconButton>
                        </>}
                </div>
                <Button variant="contained" className={classes.btn} onClick={handleClose}>Thoát</Button>
                <Button variant="contained" color='primary' className={classes.btn} onClick={submitEditCriteria} disabled={!existCriteria.length || JSON.stringify(existCriteria) === JSON.stringify(temp.existCriteria)}>Lưu</Button>
            </div>


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
export default ModalEditStandard