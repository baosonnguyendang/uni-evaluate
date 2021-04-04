import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PersonIcon from '@material-ui/icons/Person';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';

export function MainListItems() {
  return (
    <div>
      <ListItem button component={Link} to={'/admin/user'}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Người dùng" />
      </ListItem>
      <ListItem button component={Link} to={'/admin/faculty'}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="DS Đơn vị" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItem>

      <Divider />

      <ListItem button component={Link} to={'/admin/criterion'}>
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
      <ListItem button component={Link} to={'/admin/criteria'}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="DS Tiêu chí" />
      </ListItem>
      <ListItem button component={Link} to={'/admin/evaluate-settings'}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="DS Đợt đánh giá" />
      </ListItem>
    </div>
  )
}
