import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PersonIcon from '@material-ui/icons/Person';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { NavLink } from 'react-router-dom';
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
    background: "rgba(224, 224, 224, 1)",
  },
  navLink: {
    textDecoration: 'none',
    color: '#212529',
    paddingLeft: '23px',
    '&:hover': {
      textDecoration: 'none',
      color: '#212529',
      background: "rgba(224, 224, 224, 1)"
    }
  }
}
))

export function MainListItems() {
  const classes = useStyles()
  return (
    <>
      <ListItem button className={classes.navLink} component={NavLink} to={'/admin/user'} activeClassName={classes.active}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Người dùng" />
      </ListItem>
      <ListItem button className={classes.navLink} component={NavLink} to={'/admin/faculty'} activeClassName={classes.active}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Đơn vị" />
      </ListItem>
      {/* <ListItem button className={classes.navLink} component={NavLink} to={'/admin/criteria'} activeClassName={classes.active}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItem> */}

      <ListItem button className={classes.navLink} component={NavLink} to={'/admin/criterion'} activeClassName={classes.active}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Tiêu chuẩn" />
      </ListItem>
      <ListItem button className={classes.navLink} component={NavLink} to={'/admin/evaluate-settings'} activeClassName={classes.active}>
        <ListItemIcon>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText primary="Đợt đánh giá" />
      </ListItem>
    </>
  )
}
