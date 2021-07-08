import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Link, useParams, useRouteMatch } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';

import EmployeeList from '../user-head-unit/user-employee-list'

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
});

export default function CouncilEmployeeList() {
  const classes = useStyles();
  const token = localStorage.getItem('token')
  const { id1, id2 } = useParams()
  const { url } = useRouteMatch()

  axios.get(`/user/head/${id1}/${id2}/get`, { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => {
      console.log(res.data)
    })
    .catch(err => {
      console.log(err)
    })

    axios.get(`/user`, { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => {
      console.log(res.data)
    })
    .catch(err => {
      console.log(err)
    })

  return (
    <EmployeeList />
  )
}