import React, { useState, useEffect } from 'react';

import { Route, Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Fade from '@material-ui/core/Fade';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
}))

//ds vien chuc thuoc don vi duoc chon
const users = [
  { name: 'A', id: '1712970', chosen: true },
  { name: 'AA', id: '1712972', chosen: true },
  { name: 'AAA', id: '1712973', chosen: true },
  { name: 'AIA', id: '1712974', chosen: true },
]

const group = 1

export default function UserSettings(props) {
  const classes = useStyles()

  //cai nay la de sau khi check hoac uncheck se render lai luon
  const [state, setState] = React.useState(true);

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        Nhóm 0{group} -
      </Typography>
      <Paper>
        <FormGroup>
          {users.map(user => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={user.chosen}
                    onChange={() => { user.chosen = !user.chosen; setState(!state) }}
                    name="checkedB"
                    color="primary"
                  />
                }
                label={user.id + ' - ' + user.name}
              />
            )
          })}
        </FormGroup>
      </Paper>
    </div>
  )
}