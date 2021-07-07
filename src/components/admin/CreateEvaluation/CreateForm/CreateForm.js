import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Tooltip, Typography, IconButton, TextField, Button, ListItem, List, ListItemText, Box } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import RestoreIcon from '@material-ui/icons/Restore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Loading from '../../../common/Loading'
import ModalEditStandard from './ModalEdit'
import ModalAddStandard from './ModalAdd'
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../../actions/notifyAction'
import HelpIcon from '@material-ui/icons/Help';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { Fade, Modal, Backdrop } from '@material-ui/core'

import PreviewModal from './PreviewModal'
//fix out of drag
let portal = document.createElement("div");
document.body.appendChild(portal);

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position: 'absolute',
    width: '648px',
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
  },
}));

export default function ModifyForm({ fcode }) {
  const dispatch = useDispatch()
  const classes = useStyles();

  // loading
  const [loading, setLoading] = useState(true)
  // modal edit
  const [open, setOpen] = React.useState(false);
  // modal add
  const [openAddModal, setOpenAddModal] = useState(false)
  const handleOpen = () => {
    setOpen(true);
  };
  const handleOpenAddModal = () => {
    setOpenAddModal(true)
  }

  const handleClose = () => {
    setOpenAddModal(false)
    setOpen(false);
  };
  // tiêu chuẩn đã có trong form và dùng để restore
  const [temp, setTemp] = React.useState([])
  // tiêu chí đc chonj
  const [tempStandard, setTempStandard] = useState(null)
  // tiêu chuẩn có sẵn trong form được chọn
  const [existStandards, setExistStandards] = React.useState([])
  // tất cả tiêu chuẩn 
  const [standards, setStandards] = React.useState(null)
  const id = fcode || "TestForm"
  const fetchAllStandardOfForm = () => {

    return axios.get(`/admin/form/${id}/getFormStandard`)
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
    return axios.get(`/admin/standard`)
      .then(res => {
        console.log(res.data)
        return res.data.standards
      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {
    Promise.all([fetchAllStandard(), fetchAllStandardOfForm()])
      .then(res => {
        console.log(res)
        const listStandards = res[1].map(s => s.code)
        setStandards(res[0].filter(s => !listStandards.includes(s.code)))
        setTemp({ standards: res[0].filter(s => !listStandards.includes(s.code)), existStandards: res[1] })
        setLoading(false)
      })
  }, [])
  console.log(existStandards)
  const handleOnDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(existStandards)
    const [reorderItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderItem)
    setExistStandards(items)
  }
  const deleteCriterion = (i) => {
    setStandards([...standards, existStandards[i]])
    setExistStandards(existStandards.filter((c, index) => index !== i))
  }
  const handleChangePoint = (e, i) => {
    console.log(e.target.value)
    setExistStandards(existStandards.map((c, index) =>
      index === i ? { ...c, standard_point: parseInt(e.target.value) } : c
    ))
  }
  const restore = () => {
    setStandards(temp.standards)
    setExistStandards(temp.existStandards)
  }
  const [modal, setModal] = useState({})
  const onEdit = (idForm, codeStandard, name) => {
    handleOpen()
    setModal({ id: idForm, code: codeStandard, name })
  }
  const onAdd = (idForm, codeStandard, name) => {
    if (!name) return
    handleOpenAddModal()
    setModal({ id: idForm, code: codeStandard, name, stt: existStandards.length + 1 })
  }
  // them moi va xoa tieu chuan trong combobox
  const addStandard = (point) => {
    const existStandardsTemp = [...existStandards, { ...tempStandard, standard_point: point }]
    const standardstemp = standards.filter(s => s.code !== tempStandard.code)
    console.log(existStandardsTemp)
    console.log(standardstemp)
    setExistStandards(existStandardsTemp)
    setStandards(standardstemp)
    setTemp({ standards: standardstemp, existStandards: existStandardsTemp })
    setTempStandard({ name: '' })
  }

  const filterStandard = (data) => {
    return data.map((d, index) => ({ standard_id: d.code, standard_order: index + 1, standard_point: d.standard_point }))
  }
  const saveForm = () => {
    setLoading(true)
    const data = { standards: filterStandard(existStandards) }
    axios.post(`/admin/form/${id}/editFormStandard`, data)
      .then(res => {
        setLoading(false)
        dispatch(showSuccessSnackbar('Lưu thành công'))
        console.log(res.data)
        setTemp({ standards, existStandards })
      })
      .catch(err => {
        console.log(err)
        dispatch(showErrorSnackbar('Lưu thất bại'))
        setLoading(false)
      })
  }

  const [openn, setOpenn] = React.useState(false);

  const handleOpenn = () => {
    setOpenn(true);
  };

  const handleClosee = () => {
    setOpenn(false);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Typography gutterBottom variant='h5' id="transition-modal-title">Danh sách tiêu chuẩn, tiêu chí trong biểu mẫu</Typography>
        <Tooltip title={
          <Typography variant='subtitle2'>Kéo thả tiêu chuẩn để thay đổi thứ tự hiển thị trong biểu mẫu</Typography>
        }>
          <HelpIcon fontSize='small' color='action' />
        </Tooltip>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Autocomplete
          loading={!standards}
          loadingText="Đang tải..."
          id="criterion-select"
          style={{ width: "40%" }}
          options={standards || []}
          classes={{
            option: classes.option,
          }}
          size="small"
          autoHighlight
          noOptionsText='Không tồn tại'
          getOptionLabel={(option) => option.name}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionDisabled={(option) => !temp.standards.includes(option)}
          onChange={(event, value) => setTempStandard(value)}
          value={tempStandard}
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
        <Tooltip title='Thêm tiêu chuẩn'>
          <IconButton
            aria-label="add"
            color="primary"
            onClick={() => onAdd(id, tempStandard?.code, tempStandard?.name)}
          >
            <AddCircleIcon />
          </IconButton>
        </Tooltip>

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
                      : <Tooltip title={
                        t.description && <Typography variant='subtitle2'>{t.description}</Typography>
                      }>
                        <ListItem {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          <ListItemText primary={`${index + 1}. ${t.name}`} style={{ flexBasis: 0 }} />
                          <TextField style={{ width: "100px" }} type="number" variant="outlined" size="small" label="Điểm"
                            onChange={(e) => handleChangePoint(e, index)}
                            defaultValue={t.standard_point}
                          />
                          <Tooltip title='Sửa'>
                            <IconButton onClick={() => onEdit(id, t.code, t.name)} style={{ marginLeft: '10px' }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Xóa'>
                            <IconButton onClick={() => deleteCriterion(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
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
          <Tooltip title="Khôi phục">
            <IconButton
              aria-label="add"
              color="primary"
              onClick={restore}
            >
              <RestoreIcon />
            </IconButton>
          </Tooltip>
        </div>

        <div style={{ display: 'contents' }}>
          <Tooltip title='Xem trước biểu mẫu' component={Box}>
            <IconButton onClick={handleOpenn}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" color='primary'
            className={classes.btn}
            disabled={JSON.stringify(temp.existStandards) === JSON.stringify(existStandards)}
            onClick={saveForm}
          >Lưu</Button>
        </div>
      </div>

      {openn && <PreviewModal id={id} standards={existStandards} open={openn} handleClose={handleClosee} />}


      <Loading open={loading} />
      {openAddModal && <ModalAddStandard idForm={modal.id} codeStandard={modal.code} name={modal.name} open={openAddModal} handleClose={handleClose} stt={modal.stt} setCriterion={addStandard} />}
      {open && <ModalEditStandard idForm={modal.id} codeStandard={modal.code} name={modal.name} open={open} handleClose={handleClose} />}
    </>
  );
}
