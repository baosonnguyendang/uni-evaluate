import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import PersonIcon from '@material-ui/icons/Person';
import { Link } from 'react-router-dom';

export function MainListItems() {
  return (
    <div>
      <ListItem button component={Link} to={'/user/info'}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Thông tin cá nhân" />
      </ListItem>
      <ListItem button component={Link} to={'/user/evaluate'}>
        <ListItemIcon>
          <AssignmentTurnedInIcon />
        </ListItemIcon>
        <ListItemText primary="Thực hiện đánh giá" />
      </ListItem>
    </div>
  )
}
