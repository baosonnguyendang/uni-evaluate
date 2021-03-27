import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PersonIcon from '@material-ui/icons/Person';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  menu: {
    display: 'contents',
    textDecoration: 'none'
  }
}));

export function MainListItems() {
  const classes = useStyles();
  return (
    <div>
      <ListItem button>
        <Link to='/dashborad/user' className={classes.menu}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Người dùng" />
        </Link>
      </ListItem>
      <ListItem button>
        <Link to='/dashboard/user' className={classes.menu}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Customers" />
        </Link>
      </ListItem>
      <ListItem button>
        <Link to='/dashboard/user' className={classes.menu}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </Link>
      </ListItem>
    </div>
  )
}

export function SecondaryListItems() {
  const classes = useStyles();
  return (
    <div>
      <ListSubheader inset>Tùy chỉnh đánh giá</ListSubheader>
      <ListItem button>
        <Link to="/dashboard/user" className={classes.menu}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="DS Tiêu chuẩn" />
        </Link>
      </ListItem>
      <ListItem button>
        <Link to="/dashboard/user" className={classes.menu}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="DS Tiêu chí" />
        </Link>
      </ListItem>
      <ListItem button>
        <Link to="/dashboard/user" className={classes.menu}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="DS Đợt đánh giá" />
        </Link>
      </ListItem>
    </div>
  )
}