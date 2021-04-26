import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PersonIcon from '@material-ui/icons/Person';
import Divider from '@material-ui/core/Divider';
import { Link, NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core'
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    }
  },
  active: {
    background:"rgba(224, 224, 224, 1)",
    hover:{
      background: "rgba(224, 224, 224, 1)"
    }
  }
}
  ))

export function MainListItems() {
  const classes = useStyles()
  return (
    <div>
      <ListItem button component={NavLink} to={'/admin/user'} activeClassName={classes.active}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Người dùng" />
      </ListItem>
      <ListItem button component={NavLink} to={'/admin/faculty'}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="DS Đơn vị" />
      </ListItem>
      <ListItem button component={NavLink} to={'/admin/criteria'}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItem>

      <Divider />

      <ListItem button component={NavLink} to={'/admin/criterion'}>
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
      <ListItem button component={Link} to={'/admin/evaluate-settings'}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="DS Đợt đánh giá" />
      </ListItem>
    </div>
  )
}
