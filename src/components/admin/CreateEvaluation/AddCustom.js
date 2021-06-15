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
import AddCircleIcon from '@material-ui/icons/AddCircle';
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
  }),
);

export default function PinnedSubheaderList() {
  const classes = useStyles();
  const [type, setType] = React.useState('');
  const [value, setValue] = React.useState('');
const [items, setItems] = useState([0, 1, 2, 3 ,4 ,5, 6 ,7])
  const handleChange = (event) => {
    setType(event.target.value );
  };
  const addNewItem = (e) => {
      e.preventDefault()
    setItems([value, ...items ])
  }
  return (
      <>
      <Typography variant='h5' gutterBottom>Thêm gì đây</Typography>
      <form onSubmit={addNewItem}>
      <TextField  className={classes.formControl} onChange={(e) => setValue(e.target.value)} label="Tên" required autoFocus variant="outlined" />
      <br/>
      <FormControl className={classes.formControl}  variant="outlined">
          
        <InputLabel id="demo-simple-select-label">Loại</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          required
          onChange={handleChange}
          label = 'Loại'
        >
          <MenuItem value={'book'}>Sách, tài liệu</MenuItem>
          <MenuItem value={'newpaper'}>Báo, tạp chí</MenuItem>
          <MenuItem value={'subject'}>Đề tài, sáng kiến</MenuItem>
        </Select>
      </FormControl>
      <br/>
      <Button className={classes.formControl}  type="submit" variant="contained" color="primary" >
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
    </>
  );
}
