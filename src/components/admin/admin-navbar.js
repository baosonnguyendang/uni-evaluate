import React from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { MainListItems } from './admin-listItems';
import BasicTable from "./admin-user"
import Faculty from "./admin-faculty"
import EvaluateList from './admin-evaluate'
import EvaluateSetting from './evaluate-setting/admin-evaluate-setting'
import AddCriterion from './evaluate-setting/admin-add-criterion'
import Criteria from './admin-criteria'
import Criterion from './admin-criterion'
import Sub from './admin-sub'
import logo from '../../img/logo.png'

import { BrowserRouter as Router, Switch, Route, Redirect, NavLink } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { logout } from '../../actions/authActions'
import { useHistory } from "react-router-dom";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 10,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    height: '100vh',
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  b: {
    width: '80px',
    margin: '10px',
    textAlign: 'end',
  },
  logo: {
    maxWidth: '60px',
    marginRight: '10px'
  }
}));

export default function Dashboard() {
  const classes = useStyles();
  const dispatch = useDispatch()
  //dong, mo menu
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const history = useHistory();
  //dang xuat

  const handleClick = () => {
    dispatch(logout())
    history.push('/')
  };
  let isLogged = localStorage.getItem('token') && localStorage.getItem('role')
  return (
    <div className={classes.root}>
      {
        isLogged ? (localStorage.getItem('role') === 'user' && <Redirect to='/user' />) : <Redirect to='/' />
      }
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <img className={classes.logo} src={logo} alt='' />
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            LVTN
          </Typography>
            <IconButton onClick={handleClick} style={{color: 'white'}} aria-controls="simple-menu" aria-haspopup="true" >
              <ExitToAppIcon />
            </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {/* <List>{mainListItems}</List> */}
        <List><MainListItems /></List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Switch>
                <Route exact path='/admin/user' children={<BasicTable className={classes.paper} />} />
                <Route exact path='/admin/faculty' children={<Faculty className={classes.paper} />} />
                <Route exact path='/admin/evaluate-settings' children={<EvaluateList className={classes.paper} />} />
                <Route exact path='/admin/evaluate-settings/:id' children={<EvaluateSetting className={classes.paper}/>} />
                <Route exact path='/admin/evaluate-settings/:id/:id' children={<AddCriterion className={classes.paper}/>} />
                <Route exact path='/admin/criterion' children={<Criterion className={classes.paper} />} />
                <Route exact path='/admin/criteria/' children={<Sub className={classes.paper} />} />
                <Route path='/admin/criteria/:id' children={<Criteria className={classes.paper} />} />
              </Switch>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}