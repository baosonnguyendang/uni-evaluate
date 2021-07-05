import React, { useState, useEffect } from 'react'

import axios from 'axios'

import { Link, useParams, useRouteMatch } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { Paper, Typography, List, ListItemText, ListItem } from '@material-ui/core';
import Loading from '../../common/Loading'

const useStyles = makeStyles(theme => ({
  paper: {
    minHeight: 440,
    marginTop: 24,
    position: 'relative',
    padding: '10px'
  }
}))

export default function ResultsUnit() {
  const classes = useStyles()

  var { url } = useRouteMatch();

  const { id, id1 } = useParams()
  const token = localStorage.getItem('token')
  const [units, setUnits] = useState(null) //ds đơn vị trong đợt đánh giá

  useEffect(() => {
    axios.get(`/admin/review/${id}/formtype/${id1}/form/`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        axios.get(`/admin/form/${res.data.form.code}/getFormDepartments`, { headers: { "Authorization": `Bearer ${token}` } })
          .then(res => {
            console.log(res.data)
            let temp = res.data.formDepartments.map(y => y.department_id)
            setUnits(temp)
          })
          .catch(e => console.log(e))
      })
      .catch(e => {
        console.log(e)
      })
  }, [])
  if (!units) return <Paper className={classes.paper}>
    <Typography component="h4" variant="h6" color="inherit" noWrap>
      Các đơn vị tham gia đánh giá
    </Typography>
    <div>
      <Loading open />
    </div>
  </Paper>

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h5" color="inherit" noWrap>
          Các đơn vị tham gia đánh giá
        </Typography>
        <div>
          <List >
            {units.filter(x => x.department_code != 'HDDG').map(unit => {
              return (
                <ListItem button key={unit._id} component={Link} to={`${url}/${unit.department_code}`}>
                  <ListItemText primary={unit.name} />
                </ListItem>
              )
            })}
          </List>
        </div>
      </Paper>
    </div>
  )
}