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
const ModalEditCriteria = ({ open, handleClose, listCriteria, setCriterion }) => {
    const [modalStyle] = React.useState(getModalStyle);
    const classes = useStyles();
    // tiêu chí trong tiêu chí
    const [availableCriteria, setAvailableCriteria] = useState(null)
    useEffect(() => {
        setAvailableCriteria(listCriteria?.criteria)
        setListTempCriteria([])
    }, [listCriteria])
    // tiêu chí đc chon
    const [tempCriteria, setTempCriteria] = useState(null)
    // list tiêu chí được chọn 
    const [listTempCriteria, setListTempCriteria] = useState([])
    // tiêu chuẩn và tiêu chí được chọn
    const [standards, setStandards] = React.useState([])


    const handleOnDragEnd = (result) => {
        console.log(result)
        if (result.destination?.droppableId === 'delete'){
            setAvailableCriteria([...availableCriteria, listTempCriteria[result.source.index]])
            setListTempCriteria(listTempCriteria.filter((c, index) => index !== result.source.index))
            return
        }
        if (!result.destination) return
        
        const items = Array.from(listTempCriteria)
        const [reorderItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderItem)
        setListTempCriteria(items)
    }
    const submitCriterion = () => {
        setCriterion(listCriteria)
        handleClose()
    }
    const body = (
        <div style={modalStyle} className={classes.paper} >
            <Typography variant='h5' gutterBottom id="simple-modal-title">{`${listCriteria.name} - Chọn tiêu chí`}</Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>

                <Autocomplete
                    loading={!availableCriteria}
                    loadingText="Đang tải..."
                    id="criteria-select"
                    style={{ width: 500 }}
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
                        <List {...provided.droppableProps} ref={provided.innerRef} style={{minHeight: '300px'}}>
                            {listTempCriteria.map((t, index) =>
                                <Draggable key={t._id} draggableId={t.code} index={index}>
                                    {(provided, snapshot) => (
                                        (snapshot.isDragging) ?
                                            ReactDOM.createPortal(<ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                <ListItemText primary={`${index + 1}. ${t.name}`} />
                                            </ListItem>, portal)
                                            : <ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                <ListItemText primary={`${index + 1}. ${t.name}`} />
                                            </ListItem>
                                    )
                                    }
                                </Draggable>
                            )}
                            {provided.placeholder}
                        </List>
                    )}
                </Droppable >
                <Droppable droppableId="delete">
                    {(provided, snapshot) => (
                        <List {...provided.droppableProps} ref={provided.innerRef}>
                            <ListItem></ListItem>
                            <ListItem >
                                <ListItemIcon>
                                    <DeleteIcon />
                            </ListItemIcon>
                                <ListItemText primary={`Kéo thả vào đây để xoá`} />
                            </ListItem>     
                            <ListItem></ListItem>

                        </List>
                    )}
                </Droppable>
            </DragDropContext>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flexGrow: 1 }}>
                    <IconButton
                        aria-label="add"
                        color="primary"
                        edge='end'
                    >
                        <RestoreIcon />
                    </IconButton>
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
    // tiêu chuẩn đc chọn
    const [temp, setTemp] = React.useState([])
    // list tiêu chuẩn đc chọn
    const [listtemp, setListTemp] = React.useState([])
    // tiêu chí đc chonj
    const [tempCriteria, setTempCriteria] = useState([])
    // tiêu chuẩn và tiêu chí được chọn
    const [standards, setStandards] = React.useState([])
    const handleChangeStandard = (e) => {
        setTemp(e.target.value)
    }
    // tiêu chí được cho
    const [criteria, setCriteria] = useState('')

    const token = localStorage.getItem('token')
    const config = { headers: { "Authorization": `Bearer ${token}` } }
    const fetchAllStandardAndCriterion = () => {
        axios.get(`admin/standard/criteria`, config)
            .then(res => {
                console.log(res.data)
                setStandards(res.data.standards)
            })
    }
    useEffect(() => {
        fetchAllStandardAndCriterion()
    }, [])
    const handleOnDragEnd = (result) => {
        if (!result.destination) return
        const items = Array.from(listtemp)
        const [reorderItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderItem)
        setListTemp(items)
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
                        onClick={handleOpen}
                    >
                        <AddCircleIcon />
                    </IconButton>
                </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId='criterion'>
                        {(provided) => (
                            <List {...provided.droppableProps} ref={provided.innerRef} style={{minHeight: '300px'}}>
                                {listtemp.map((t, index) =>
                                    <Draggable key={t._id} draggableId={t.code} index={index}>
                                        {(provided, snapshot) => (
                                            (snapshot.isDragging) ?
                                                ReactDOM.createPortal(<ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <ListItemText primary={`${index + 1}. ${t.name}`} />
                                                </ListItem>, portal)
                                                : <ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                    <ListItemText primary={`${index + 1}. ${t.name}`} />
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
                        edge='end'
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
            <ModalEditCriteria open={open} handleClose={handleClose} listCriteria={temp} setCriterion={(e) => setListTemp(prev => [...prev, e])} />
        </Paper>
    );
}
