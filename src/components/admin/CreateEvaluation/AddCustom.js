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
  const data = {
    disableEdit: false,
    name: 'Tham gia viết sách',
    code: 'TC002-A',
    max_point: 20,
    base_point: 4.5,
    details: [ {name: "danh", value: ""},
    {name: "danh2", value: "10", description: "hahahaahahhahaahahahaaaaaaaaaaaaaaaaaaaaaaa"},
    {name: "danh3", value: "103"}]
}
const data1 = {
  disableEdit: false,
  name: 'Tham gia viết sách',
  code: 'TC002-A',
  max_point: 20,
  base_point: 4,
  details: []
}
  return (
    <>

      <TextField onClick={() => { dispatch(showModal((data)=>console.log(data), "TIMES_MODAL", data1)) }} type="button" value={1} onMouseUp={e => e.target.blur()} style={{ width: 100 }} variant="outlined" />


        <TextField onClick={() => { dispatch(showModal((data)=>console.log(data), "DETAIL_MODAL",data)) }} type="button" value={1}  onMouseUp={e => e.target.blur()} style={{width:100}} variant="outlined" />
      
    </>
  );
}
