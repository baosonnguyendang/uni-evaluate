import React from 'react'
import Navbar from './admin-navbar'
import UserTable from "./admin-user"
import Faculty from "./admin-faculty/admin-faculty"
import UserOfFaculty from "./admin-faculty/admin-faculty-listuser"

import EvaluateList from './admin-evaluate'

import EvaluateSetting from './evaluate-setting/admin-evaluate-setting'
import AddSettings from './evaluate-setting/admin-add-settings'

import Criteria from './standard-list/admin-criteria'
import Criterion from './standard-list/admin-criterion'
import Selection from './standard-list/admin-selection'

import ResultsList from './results/admin-results-overall'
import Results from './results/admin-results-unit'
import ResultsDetailed from './results/admin-results-detailed'

import NotFound from '../common/NotFound'

import { Switch, Route, Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import DeletedCriterion from './RestoreList/DeletedCriterion'
import DeletedCriteria from './RestoreList/DeletedCriteria'
import DeletedSelection from './RestoreList/DeletedSelection'
import DeletedFaculty from './RestoreList/DeletedFaculty'
import DeletedSubFaculty from './RestoreList/DeletedSubFaculty'
import DeletedUser from './RestoreList/DeletedUser'
import DeletedEvaluateList from './RestoreList/DeletedEvaluateList'

import Test from './CreateEvaluation/AddCustom'
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
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
  const token = localStorage.getItem('token')
  let role = localStorage.getItem('token') && localStorage.getItem('role')
  return (
    <div className={classes.root}>
      {!token && <Redirect to='/' />}
      {role !== 'admin' && <Redirect to='/forbidden' />}
      <Navbar />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Switch>
                <Route exact path='/admin/user' component={UserTable} />
                <Route exact path='/admin/user/deleted' component={DeletedUser} />
                <Route exact path='/admin/criteria' children={<Test />} />
                <Route exact path='/admin/faculty' children={<Faculty />} />
                <Route exact path='/admin/faculty/deleted' children={<DeletedFaculty />} />
                <Route exact path='/admin/faculty/:id' children={<UserOfFaculty />} />
                <Route exact path='/admin/faculty/:id/deleted' children={<DeletedSubFaculty />} />
                <Route exact path='/admin/evaluate-settings' children={<EvaluateList />} />
                <Route exact path='/admin/evaluate-settings/deleted' children={<DeletedEvaluateList />} />
                <Route exact path='/admin/evaluate-settings/:id' children={<EvaluateSetting />} />
                <Route exact path='/admin/evaluate-settings/:id/:id1' children={<AddSettings />} />
                <Route exact path='/admin/evaluate-settings/:id/:id1/results/:id2' children={<Results />} />
                <Route exact path='/admin/evaluate-settings/:id/:id1/results/:id2/:id3' children={<ResultsDetailed />} />
                <Route exact path='/admin/evaluate-settings/:id/:id1/results' children={<ResultsList />} />
                <Route exact path='/admin/criterion' children={<Criterion />} />
                <Route exact path='/admin/criterion/deleted' children={<DeletedCriterion />} />
                <Route exact path='/admin/criterion/:id' children={<Criteria />} />
                <Route exact path='/admin/criterion/:id/deleted' children={<DeletedCriteria />} />
                <Route exact path='/admin/criterion/:id/:id1' children={<Selection />} />
                <Route exact path='/admin/criterion/:id/:id1/deleted' children={<DeletedSelection />} />
                <Route exact path='/admin' children={<div></div>} />
                <Route path="*">
                  <NotFound />
                </Route>
              </Switch>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  )
}

export default AdminPage
