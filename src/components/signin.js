import React, { Component, setState, useState } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import logo from '../img/logo.png'
import Typography from '@material-ui/core/Typography';
import { Alert } from '@material-ui/lab';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../actions/authActions'
import { makeStyles, LinearProgress } from '@material-ui/core'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <a color="inherit" href="https://material-ui.com/">
        hehe
            </a>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    overflowY: 'none',
  },
  image: {
    backgroundImage: 'url(/img/theme.jfif)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(6, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  // avatar: {
  //     margin: theme.spacing(1),
  //     backgroundColor: theme.palette.secondary.main,
  // },
  logo: {
    width: '15vw',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


const SignInSide = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.auth.isLoading);
  const classes = useStyles()
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({email:username,password}))
  }
  const onChangeUsername = (e) => { setUsername(e.target.value)}
  const onChangePassword = (e) => { setPassword(e.target.value)}
  const isLogged = useSelector(state => state.auth.isAuthenticated)
  const error = useSelector(state => state.error.msg)
  return (
    <>
      {isLoading &&<LinearProgress style={{position:"absolute", width:"100%" }} />}
    <Grid container component="main" className={classes.root}>
      {
          isLogged && (localStorage.getItem('role') === 'admin' ? <Redirect to='/admin/user' /> : <Redirect to='/user' />)
      }
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>

        <div className={classes.paper}>
          <img className={classes.logo} src={logo} alt='' />
          <form className={classes.form} onSubmit={onSubmit}>
            <TextField
              onChange={onChangeUsername}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              onChange={onChangePassword}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {error && <Alert severity="error">{error}</Alert>}
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} >
                Sign In
              </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/user/info" variant="body2">Forgot password?</Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
    </>
  );
}


export default (SignInSide)