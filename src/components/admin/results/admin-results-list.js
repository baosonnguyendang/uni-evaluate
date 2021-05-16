import React, { useState, useEffect } from 'react';

import axios from 'axios'

import { Link, useParams, useRouteMatch } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
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
  const [units, setUnits] = useState([]) //ds đơn vị trong đợt đánh giá

  var { url } = useRouteMatch();

  //mã form
  const [code, setCode] = useState()
  

  //lấy mã form
  useEffect(()=> {
    axios.get(`/admin/review/${id}/formtype/${id1}/form/`, { headers: { "Authorization": `Bearer ${token}` } })
    .then(res => {
      if (res.data.form) {
        // setCode(res.data.form.code)
        setCode(res.data.form.code)
        //lấy các đơn vị cha nằm trong đợt đánh giá
        axios.get(`/admin/form/${res.data.form.code}/getFormDepartments`, { headers: { "Authorization": `Bearer ${token}` } })
          .then(res => {
            let temp = res.data.formDepartments.filter(x => (x.level === 1 || x.level === 0)).map(y => y.department_id)
            setUnits(temp)
          })
          .catch(e => console.log(e))
      }
    })
    .catch(e => {
      console.log(e)
    })
  }, [])

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        Đợt {id} - Nhóm {id1} - Mã Form: {code}
      </Typography>
      <Paper className={classes.paper}>
        <Typography component="h4" variant="h6" color="inherit" noWrap>
          Các đơn vị tham gia đánh giá
        </Typography>
        <div>
          <ul>
            {units.map(unit => {
              return (
                <li key={unit._id} ><Link to={`${url}/${unit.department_code}`}>{unit.name}</Link></li>
              )
            })}
          </ul>
        </div>
      </Paper>
    </div>
  )
}

