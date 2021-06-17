import React, { useState, useEffect } from 'react'

import axios from 'axios'

import { Link, useParams, useRouteMatch } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { Paper, Typography, Button } from '@material-ui/core';

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
  const [units, setUnits] = useState([]) //ds đơn vị trong đợt đánh giá

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

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography component="h4" variant="h6" color="inherit" noWrap>
          Các đơn vị tham gia đánh giá
        </Typography>
        <div>
          <ul>
            {units.filter(x => x.department_code != 'HDDG').map(unit => {
              return (
                <li key={unit._id} ><Link to={`${url}/${unit.department_code}`}>{unit.name}</Link></li>
              )
            })}
          </ul>
        </div>
        {/* <div style={{ position: 'absolute', bottom: '10px' }}>
          <Button variant="contained" color="secondary" onClick={() => { setValue(0) }}>Trở lại trang thống kê chung</Button>
          <Button style={{ marginLeft: 10 }} variant="contained" color="inherit" onClick={() => { setValue(0) }}>Xem chi tiết GV/VC</Button>
        </div> */}
      </Paper>
    </div>
  )
}