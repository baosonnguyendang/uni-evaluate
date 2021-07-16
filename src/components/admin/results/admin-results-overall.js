import React, { useState, useEffect } from 'react';

import AdminChart from './admin-results-chart'

import axios from 'axios'

import { useParams, useRouteMatch } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import ResultsDashboard from './admin-results-detailed2';
import ResultsUnit from './admin-results-unitlist';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import { List, ListItem, ListItemAvatar, ListItemText, Divider } from '@material-ui/core';

import EqualizerIcon from '@material-ui/icons/Equalizer';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Loading from '../../common/Loading'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '24px',
    display: 'inline-block',
    width: '23%'
  },
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
  const { id, id1 } = useParams()

  const [loading, setLoading] = useState(false)


  //mã form
  const [code, setCode] = useState()

  //lấy mã form
  useEffect(() => {
    setLoading(true)
    axios.get(`/admin/review/${ id }/formtype/${ id1 }/form/`)
      .then(res => {
        if (res.data.form) {
          setCode(res.data.form.code)
        }
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        setLoading(false)
      })
  }, [])


  const [stage, setStage] = useState(null)

  const MenuEvaluate = () => {
    const classes = useStyles();
    const Menu = () => {
      return (
        <Paper style={{ padding: 10 }} className={classes.paper}>
          <Typography style={{ flexGrow: 1, marginLeft: 10 }} variant='h5' gutterBottom>Kết quả đánh giá</Typography>
          <List className={classes.list}>
            <ListItem button onClick={() => { setStage(1) }} >
              <ListItemAvatar>
                <EqualizerIcon fontSize='large' color='action' />
              </ListItemAvatar>
              <ListItemText
                primary={<>Thống kê chung</>}
                secondary={"Số liệu tổng quát về đợt đánh giá"}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem button onClick={() => { setStage(2) }}>
              <ListItemAvatar>
                <FormatListBulletedIcon fontSize='large' color='action' />
              </ListItemAvatar>
              <ListItemText
                primary={<>Xem kết quả theo phân loại tiêu chuẩn</>}
                secondary={"Kết quả đánh giá từng cá nhân theo tiêu chuẩn"}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem button onClick={() => { setStage(3) }}>
              <ListItemAvatar>
                <AssignmentIndIcon fontSize='large' color='action' />
              </ListItemAvatar>
              <ListItemText
                primary={"Xem chi tiết biểu mẫu"}
                secondary={"Xem chi tiết biểu mẫu của từng cá nhân"}
              />
            </ListItem>
          </List>
        </Paper>
      )
    }
    let body = null
    switch (stage) {
      case 1:
        body = <AdminChart code={code} />
        break
      case 2:
        body = (
          <div style={{ marginTop: '24px' }}>
            <ResultsDashboard code={code} />
          </div>
        )
        break
      case 3:
        body = <ResultsUnit />
        break
      case 4:
        body = 4
        break
      default:
        body = <Menu />

    }
    return (
      <div style={{ maxWidth: '100%', }}>
        {body}
      </div>
    )
  }

  return (
    <div>
      <Loading open={loading} />
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        Đợt {id} - Nhóm {id1} - Mã biểu mẫu: {code} {stage != null && (stage == 1 ? '- Thống kê chung' : '- Kết quả chi tiết')}
      </Typography>
      <MenuEvaluate />
      {stage && <Button style={{ float: 'right', marginTop: 10, minWidth: 80 }} variant="contained" onClick={() => { setStage(null) }} ><KeyboardReturnIcon /></Button>}
    </div>
  )
}

