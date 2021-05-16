import React, { useState, useEffect } from 'react';

import axios from 'axios'

import { Link, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  number: {
    textAlign: 'center'
  },
  paper: {
    minHeight: 440,
    marginTop: 24,
    position: 'relative',
    padding: '10px'
  },
}))

export default function ResultsList(props) {
  const classes = useStyles()

  const { id, id1 } = useParams()

  const token = localStorage.getItem('token')

  // axios.get(`/admin/form/${code}/getFormDepartments`, { headers: { "Authorization": `Bearer ${token}` } })
  //   .then(res => {
  //     console.log(res)
  //   })
  //   .catch(e => console.log(e))

  // axios.get(`/admin/review/${id}/formtype/${id1}/form/`, { headers: { "Authorization": `Bearer ${token}` } })
  //   .then(res => {
  //     // (res.data) && (setInit(false))
  //     if (res.data.form) {
  //       code = res.data.form.code
  //       name = res.data.form.name
  //     }
  //   })
  //   .catch(e => {
  //     console.log(e)
  //   })

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        Đợt {id} - Nhóm {id1}
      </Typography>
      <Paper className={classes.paper}>
        <Typography component="h4" variant="h6" color="inherit" noWrap>
          Các đơn vị tham gia đánh giá
        </Typography>
      </Paper>
    </div>
  )
}