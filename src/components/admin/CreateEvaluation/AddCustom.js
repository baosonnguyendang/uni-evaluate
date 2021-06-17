import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { List, Button, TextField, Typography } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useDispatch } from 'react-redux'
import { showModal } from '../../../actions/modalAction'
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PostAddIcon from '@material-ui/icons/PostAdd';
import CategoryIcon from '@material-ui/icons/Category';
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
      maxHeight: 300,
    },
    listSection: {
      backgroundColor: 'inherit',
    },
    ul: {
      backgroundColor: 'inherit',
      padding: 0,
    },
    formControl: {
      margin: theme.spacing(1),
      width: 300,
    },
    root1: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    list: {
      backgroundColor: theme.palette.background.paper,
      maxWidth: '50ch',
    },
  }),
);
const MenuEvaluate = () => {
  const [stage, setStage] = useState(null)
  const classes = useStyles();
  const Menu = () => {
    return <List className={classes.list}>
      <ListItem button onClick={() => { setStage(1) }} >
        <ListItemAvatar>
          <SupervisorAccountIcon fontSize='large' color='action'/>
        </ListItemAvatar>
        <ListItemText
          primary={<>Hội đồng đánh giá</>}
          secondary={"Cấu hình thành viên hội đồng đánh giá"}
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem button onClick={() => { setStage(2) }}>
        <ListItemAvatar>
          <GroupAddIcon fontSize='large' color='action'/>
        </ListItemAvatar>
        <ListItemText
          primary={<>Đơn vị đánh giá</>}
          secondary={"Cấu hình các đợi vị tham gia đánh giá"}
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem button onClick={() => { setStage(3) }}>
        <ListItemAvatar>
          <PostAddIcon fontSize='large' color='action'/>
        </ListItemAvatar>
        <ListItemText
          primary={"Cấu hình tiêu chuẩn"}
          secondary={"Thêm, chỉnh sửa tiêu chuẩn tiêu chí biểu mẫu"}
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem button onClick={() => { setStage(4) }}>
        <ListItemAvatar>
          <CategoryIcon fontSize='large' color='action' />
        </ListItemAvatar>
        <ListItemText
          primary={<>Cấu hình xếp loại </>}
          secondary={"Các hạng mức xếp loại"}
        />
      </ListItem>
    </List>
  }
  let body = null
  switch (stage) {
    case 1:
      body = 1
      break
    case 2:
      body = 2
      break
    case 3:
      body = 3
      break
    case 4:
      body = 4
      break
    default:
      body = <Menu />
      
  }
  return (
    <div style={{ maxWidth: '100%', }}>
      <div style={{}} className={classes.root1}>
        <Typography style={{ flexGrow: 1 }} variant='h5' gutterBottom>Cấu hình biểu mẫu</Typography>
        {stage && <Button variant="contained" onClick={() => { setStage(null) }} ><KeyboardReturnIcon /></Button>}
      </div>
      {body}
    </div>
  )
}
export default function PinnedSubheaderList() {
  const classes = useStyles();
  const dispatch = useDispatch()
  const [type, setType] = React.useState('');
  const [value, setValue] = React.useState('');
  const [items, setItems] = useState([0, 1, 2, 3, 4, 5, 6, 7])
  const handleChange = (event) => {
    setType(event.target.value);
  };
  const addNewItem = (e) => {
    e.preventDefault()
    setItems([value, ...items])
  }
  return (
    <>
      <div onClick={() => { dispatch(showModal(null, 1)) }}>
        <TextField type="select" value={1} onMouseDown={(e) => console.log(e.target.blur())} onMouseUp={e => e.target.blur()} style={{ cursor: 'pointer' }} variant="outlined" />
      </div>
      <Typography variant='h5' gutterBottom>Thêm gì đây</Typography>
      <form onSubmit={addNewItem}>
        <TextField className={classes.formControl} onChange={(e) => setValue(e.target.value)} label="Tên" required autoFocus variant="outlined" />
        <br />
        <FormControl className={classes.formControl} variant="outlined">

          <InputLabel id="demo-simple-select-label">Loại</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            required
            onChange={handleChange}
            label='Loại'
          >
            <MenuItem value={'book'}>Sách, tài liệu</MenuItem>
            <MenuItem value={'newpaper'}>Báo, tạp chí</MenuItem>
            <MenuItem value={'subject'}>Đề tài, sáng kiến</MenuItem>
          </Select>
        </FormControl>
        <br />
        <Button className={classes.formControl} type="submit" variant="contained" color="primary" >
          Thêm
        </Button>
      </form>
      <List className={classes.root} >
        <ul className={classes.ul}>
          {items.map((item) => (
            <ListItem key={`item-${1}-${item}`}>
              <ListItemText primary={`${item}`} />
            </ListItem>
          ))}
        </ul>
      </List>
      <MenuEvaluate />
    </>
  );
}
