import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PersonIcon from '@material-ui/icons/Person';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';

import BasicTable from "./dashboard-admin-user"
import Faculty from "./dashboard-admin-faculty"

import { useState } from 'react'


export function MainListItems() {
  const [state, setState] = useState(0)

  function tab1() {
    setState(1)
  }

  function tab3() {
    setState(3)
  }

  function tab4() {
    setState(4)
  }

  function tab5() {
    setState(5)
  }

  switch (state) {
    // case 0:
    //   alert(0)
    //   break;
    // case 1:
    //   alert(1)
    //   break;
    // case 2:
    //   alert(2)
    //   break;
    // case 3:
    //   alert(3)
    //   break;
  }

  return (
    <div>
      <ListItem button onClick={tab1}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Người dùng" />
      </ListItem>
      <ListItem button onClick={() => { alert(state) }}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItem>
      <ListItem button onClick={tab3}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItem>

      <Divider />

      <ListItem button button onClick={tab4}>
        {/* <Link to="/dashboard/user" style={{ display: 'contents', textDecoration: 'none' }}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="DS Tiêu chuẩn" className={classes.menuLink} />
        </Link> */}
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="DS Tiêu chuẩn" />
      </ListItem>
      <ListItem button button onClick={tab5}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="DS Tiêu chí" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="DS Đợt đánh giá" />
      </ListItem>
    </div>
  )
}
