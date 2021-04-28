import React from 'react'
import Navbar from './admin-navbar'
import UserTable from "./admin-user"
import Faculty from "./admin-faculty"
import EvaluateList from './admin-evaluate'
import EvaluateSetting from './evaluate-setting/admin-evaluate-setting'
import AddCriterion from './evaluate-setting/admin-add-criterion'
import Criteria from './admin-criteria'
import Criterion from './admin-criterion'
import Results from './evaluate-setting/admin-results'
import { Switch, Route, Redirect, NavLink } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Sub from './admin-sub'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
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

const AdminPage = () => {
    const classes = useStyles()
    let isLogged = localStorage.getItem('token') && localStorage.getItem('role')
    return (
        <div className={classes.root}>
            {
            isLogged ? (localStorage.getItem('role') === 'user' && <Redirect to='/user' />) : <Redirect to='/' />
            }
            <Navbar />
            <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Route exact path='/admin/user' component={UserTable} />
                    <Route exact path='/admin/faculty' children={<Faculty />} />
                    <Route exact path='/admin/evaluate-settings' children={<EvaluateList />} />
                    <Route exact path='/admin/evaluate-settings/:id' children={<EvaluateSetting />} />
                    <Route exact path='/admin/evaluate-settings/:id/:id' children={<AddCriterion />} />
                    <Route exact path='/admin/criterion' children={<Criterion />} />
                    <Route exact path='/admin/criteria/' children={<Sub />} />
                    <Route path='/admin/criteria/:id' children={<Criteria />} />
                </Grid>
            </Grid>
            </Container>
        </main>
        </div>
    )
}

export default AdminPage
