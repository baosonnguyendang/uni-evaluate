import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PersonIcon from '@material-ui/icons/Person';
import { Link } from 'react-router-dom';

import BasicTable from "./dashboard-admin-user"
import Faculty from "./dashboard-admin-faculty"

import { useState } from 'react'


export function MainListItems() {

  function disableAll(){
    alert('abc')
  }

  function user(){
    disableAll()
  }

  return (
    <div>
      <ListItem button onClick={user}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Người dùng"/>
      </ListItem>
      <ListItem button onClick={() => { alert('clicked') }}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers"/>
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Reports"/>
      </ListItem>
    </div>
  )
}

export function SecondaryListItems() {
  return (
    <div>
      <ListSubheader inset>Tùy chỉnh đánh giá</ListSubheader>
      <ListItem button>
        {/* <Link to="/dashboard/user" style={{ display: 'contents', textDecoration: 'none' }}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="DS Tiêu chuẩn" className={classes.menuLink} />
        </Link> */}
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="DS Tiêu chuẩn"/>
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="DS Tiêu chí"/>
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="DS Đợt đánh giá"/>
      </ListItem>
    </div>
  )
}