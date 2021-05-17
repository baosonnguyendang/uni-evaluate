import React, { useState, useEffect } from 'react';

import Charts from './admin-charts'

import axios from 'axios'

import { Link, useParams, useRouteMatch } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
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
  tab: {
    backgroundColor: '#abcdef',
    padding: 0,
    width: '100%',
  }
}))

export default function ResultsList(props) {
  const classes = useStyles()
  const { id, id1 } = useParams()
  const token = localStorage.getItem('token')
  const [units, setUnits] = useState([]) //ds đơn vị trong đợt đánh giá

  var { url } = useRouteMatch();

  //mã form
  const [code, setCode] = useState()

  //change tab
  const [value, setValue] = React.useState(0);

  //lấy mã form
  useEffect(() => {
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
        Đợt {id} - Nhóm {id1} - Mã Form: {code} - {value == 0 ? 'Thống kê chung' : 'Kết quả chi tiết'}
      </Typography>
      {/* <Paper className={classes.paper}>
        <Tabs style={{ margin: '-10px 0 10px -10px', height: 36 }} value={value} onChange={(event, newValue) => { setValue(newValue) }}>
          <Tab className={classes.tab} label="Thống kê chung" />
          <Tab className={classes.tab} label="Kết quả chi tiết" />
        </Tabs> */}
      {(() => {
        switch (value) {
          case 0:
            return (
              <div>
                <div style={{margin: '24px 10px 10px 0'}}>
                  <Paper style={{ width: '30%', padding: '10px', display: 'inline-block' }}>
                    <Charts type={2} />
                  </Paper>
                  <Paper style={{ marginLeft: '10px', width: '30%', padding: '10px', display: 'inline-block'}}>
                    <Charts type={1} />
                  </Paper>
                </div>
                <Button onClick={() => { setValue(1) }} variant="contained" color="primary">Nhấn vào đây để xem kết quả chi tiết</Button>
              </div>
            )
          case 1:
            return (
              <div>
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
                  <Button onClick={() => { setValue(0) }}>A</Button>
                </Paper>
              </div>
            )
          default:
            return null
        }
      })()}
    </div>
  )
}

