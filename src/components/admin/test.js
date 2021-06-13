import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import { Tab, Box, Typography, IconButton, TextField, Button, ListItem, ListItemIcon, List, ListItemText } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import RestoreIcon from '@material-ui/icons/Restore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import BlockIcon from '@material-ui/icons/Block';
import Loading from '../common/Loading'
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}
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
        // width: '700px',
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
const ModalEditCriteria = ({ open, handleClose, listCriteria, setCriterion, idForm, codeStandard, name }) => {
    const [modalStyle] = React.useState(getModalStyle);
    const classes = useStyles();
    const [isEdit, setIsEdit] = useState(false)
    // tiêu chí trong tiêu chuẩn
    const [availableCriteria, setAvailableCriteria] = useState([])
    const [existCriteria, setExistCriteria] = useState([])
    const [temp, setTemp] = useState([]) 
    const token = localStorage.getItem('token')
    const config = { headers: { "Authorization": `Bearer ${token}` } }
    const getFormCriteria = (idForm, codeStandard) => {
        return axios.get(`/admin/form/${idForm}/standard/${codeStandard}/getFormCriteria`,config)
            .then(res => {
                console.log(res.data)
                setExistCriteria(res.data.formCriteria.map(c=> ({...c,...c.criteria_id})))
                return res.data.formCriteria.map(c=> ({...c,...c.criteria_id}))
            })
            .catch(err => {
                setExistCriteria([])
                console.log(err)
            })
    }
    const getCriteriaOfStandard = (codeStandard) => {
        return axios.get(`/admin/standard/${codeStandard}/criteria/get`,config)
        .then(res => {
            console.log(res.data)
            return res.data.criterions
        })
        .catch(err => {
            console.log(err)
        })
    }
    useEffect(() => {
        Promise.all([getFormCriteria(idForm, codeStandard),getCriteriaOfStandard(codeStandard) ])
            .then(([existCriteria, criterions]) => {
                if (existCriteria){
                    const listExistCriteria = existCriteria.map(c => c.code)
                    const availableCriteria = criterions.filter(c=> !listExistCriteria.includes(c.code))
                    setAvailableCriteria(availableCriteria)
                    setTemp({existCriteria, availableCriteria})
                }
                else {
                    setAvailableCriteria(criterions)
                }
            })

    }, [codeStandard])
    // tiêu chí đc chon
    const [tempCriteria, setTempCriteria] = useState(null)
    // list tiêu chí được chọn 
    const [listTempCriteria, setListTempCriteria] = useState([])
    // tiêu chuẩn và tiêu chí được chọn
    const [standards, setStandards] = React.useState([])


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
        setListTempCriteria(listTempCriteria.map((c, index) =>
            index == i ? { ...c, point: e.target.value } : c
        ))
    }
    console.log(listTempCriteria)
    const submitCriterion = () => {
        setCriterion(listCriteria)
        handleClose()
    }
    const restore = () => {
        setAvailableCriteria(temp.availableCriteria)
        setExistCriteria(temp.existCriteria)
    }
    const body = (
        <div style={modalStyle} className={classes.paper} >
            <Loading open={false} />
            <Typography variant='h5' gutterBottom id="simple-modal-title">{`${name} - Chọn tiêu chí`}</Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>

                <Autocomplete
                    loading={!availableCriteria}
                    loadingText="Đang tải..."
                    id="criteria-select"
                    style={{ width: 400, flexGrow: 1}}
                    options={availableCriteria || []}
                    classes={{
                        option: classes.option,
                    }}
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
                    edge='end'
                    onClick={() => {
                        if (tempCriteria.name === '') return
                        setListTempCriteria([...listTempCriteria, tempCriteria])
                        setAvailableCriteria(availableCriteria.filter(l => l.code !== tempCriteria.code))
                        setTempCriteria({ name: '' })
                    }}
                >
                    <AddCircleIcon />
                </IconButton>


            </div>
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
                                            : <ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                <ListItemText style={{width: '400px'}} primary={`${index + 1}. ${t.name}`} />
                                                <TextField style={{ width: "100px" }} type="number" variant="outlined" autoFocus required size="small" placeholder="Điểm"
                                                    onChange={(e) => handleChangePoint(e, index)}
                                                    defaultValue={t.point}
                                                    disabled={!isEdit}
                                                />
                                                <IconButton style={{visibility: isEdit ? 'visible':'hidden'}} onClick={() => deleteCriteria(index)} >
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
                <Button variant="contained" color='primary' className={classes.btn} onClick={submitCriterion}>Lưu</Button>
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
export default function DisabledTabs() {
    const [value, setValue] = React.useState(0);
    const classes = useStyles();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    // tiêu chuẩn đã có trong form và dùng để restore
    const [temp, setTemp] = React.useState([])
    // list tiêu chuẩn đc chọn
    const [listtemp, setListTemp] = React.useState([])
    // tiêu chí đc chonj
    const [tempCriteria, setTempCriteria] = useState([])
    // tiêu chuẩn có sẵn trong form được chọn
    const [existStandards, setExistStandards] = React.useState([])
    // tất cả tiêu chuẩn 
    const [standards, setStandards] = React.useState([])
    const handleChangeStandard = (e) => {
        setTemp(e.target.value)
    }

    const token = localStorage.getItem('token')
    const config = { headers: { "Authorization": `Bearer ${token}` } }
    const id = "TestForm"
    const fetchAllStandardOfForm = () => {
        
        return axios.get(`/admin/form/${id}/getFormStandard`, config)
            .then(res => {
                console.log(res.data)
                console.log(res.data.formStandards.map(t => ({ ...t, ...t.standard_id })))
                setExistStandards(res.data.formStandards.map(t => ({ ...t, ...t.standard_id })))
                return res.data.formStandards.map(t => ({ ...t, ...t.standard_id }))
            })
            .catch(err => {
                console.log(err)
            })
    }
    const fetchAllStandard = () => {
        return axios.get(`/admin/standard`, config)
            .then(res => {
                console.log(res.data)
                return res.data.standards
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        Promise.all([fetchAllStandard(),fetchAllStandardOfForm()])
        .then(res => {
            console.log(res)
            const listStandards = res[1].map(s => s.code)
            setStandards(res[0].filter(s => !listStandards.includes(s.code)))
            setTemp({standards: res[0], existStandards: res[1]})
        })
    }, [])
    console.log(existStandards)
    const handleOnDragEnd = (result) => {
        if (!result.destination) return
        const items = Array.from(listtemp)
        const [reorderItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderItem)
        setListTemp(items)
    }
    const deleteCriterion = (i) => {
        setStandards([...standards, existStandards[i]])
        setExistStandards(existStandards.filter((c, index) => index !== i))
    }
    const handleChangePoint = (e, i) => {
        console.log(e.target.value)
        setExistStandards(existStandards.map((c, index) =>
            index == i ? { ...c, standard_point: e.target.value } : c
        ))
    }
    const restore = () => {
        setStandards(temp.standards)
        setExistStandards(temp.existStandards)
    }
    const [modal, setModal] = useState({})
    const onEdit = (idForm, codeStandard, name) => {
        handleOpen()
        setModal({id: idForm, code: codeStandard, name})
    }
    return (
        <Paper square >
            <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                aria-label="disabled tabs example"
            >
                <Tab label="Active" />
                <Tab label="Disabled" />
                <Tab label="Active" />
            </Tabs>
            <TabPanel value={value} index={0}>
                <Typography gutterBottom variant='h5' id="transition-modal-title">Danh sách tiêu chuẩn</Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Autocomplete
                        loading={standards.length === 0}
                        loadingText="Đang tải..."
                        id="criterion-select"
                        style={{ width: "40%" }}
                        options={standards}
                        classes={{
                            option: classes.option,
                        }}
                        autoHighlight
                        noOptionsText='Không tồn tại'
                        getOptionLabel={(option) => option.name}
                        getOptionSelected={(option, value) => option.name === value.name}
                        onChange={(event, value) => setTemp(value)}
                        renderOption={(option) => (
                            <React.Fragment>
                                {option.code} - {option.name}
                            </React.Fragment>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Chọn tiêu chuẩn"
                                variant="outlined"
                            />
                        )}
                    />
                    <IconButton
                        aria-label="add"
                        color="primary"
                        edge='end'
                        onClick={() => onEdit(id,temp.code,temp.name)}
                    >
                        <AddCircleIcon />
                    </IconButton>
                </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId='criterion'>
                        {(provided) => (
                            <List {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: '300px' }}>
                                {existStandards.map((t, index) =>
                                    <Draggable key={t._id} draggableId={t.code} index={index}>
                                        {(provided, snapshot) => (
                                            (snapshot.isDragging) ?
                                                ReactDOM.createPortal(<ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <ListItemText primary={`${index + 1}. ${t.name}`} />
                                                </ListItem>, portal)
                                                : <ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <ListItemText primary={`${index + 1}. ${t.name}`} />
                                                    <TextField style={{ width: "100px" }} type="number" variant="outlined" autoFocus required size="small" placeholder="Điểm"
                                                        onChange={(e) => handleChangePoint(e, index)}
                                                        defaultValue={t.standard_point}
                                                    />
                                                    <IconButton onClick={() => onEdit(id,t.code,t.name)} style={{marginLeft: '10px' }}>
                                                        <EditIcon  />
                                                    </IconButton>
                                                    <IconButton onClick={() => deleteCriterion(index)}>
                                                        <DeleteIcon  />
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
                        <IconButton
                            aria-label="add"
                            color="primary"
                            onClick={restore}
                        >
                            <RestoreIcon />
                        </IconButton>
                    </div>

                    <Button variant="contained" color='primary' className={classes.btn} >Lưu</Button>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
      </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
      </TabPanel>
            {open && <ModalEditCriteria idForm={modal.id} codeStandard={modal.code} name={modal.name} open={open} handleClose={handleClose} setCriterion={(e) => setListTemp(prev => [...prev, e])} />}
        </Paper>
    );
}
