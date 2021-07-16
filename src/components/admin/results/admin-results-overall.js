import React, { useState, useEffect } from 'react';

import Charts from './admin-charts'

import axios from 'axios'

import { useParams, useRouteMatch } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import ResultsDashboard from './admin-results-detailed2';
import ResultsUnit from './admin-results-unitlist';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import { List, ListItem, ListItemAvatar, ListItemText, Divider } from '@material-ui/core';

import EqualizerIcon from '@material-ui/icons/Equalizer';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

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

  const [units, setUnits] = useState([]) //ds đơn vị trong đợt đánh giá

  var { url } = useRouteMatch();

  //mã form
  const [code, setCode] = useState()



  //lấy ít data vẽ lên biểu đồ
  const [chartData, setChartData] = useState({})
  const [chartData2, setChartData2] = useState({})
  const [chartOptions2, setChartOptions2] = useState({})
  //array gom so nguoi tham gia va khong tham gia
  const [participate, setParicipate] = useState([])

  const [rate, setRate] = useState([]) //array luu moc diem
  const [range, setRange] = useState([]) //array chua so luong gv moi moc diem

  //diem so
  const [point, setPoint] = useState([0])

  const getChartData = () => {
    setChartData({
      labels: [
        'Đã đánh giá',
        'Chưa đánh giá',
      ],
      datasets: [
        {
          data: [participate[0], participate[1]],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
          ]
        }
      ]
    })
    // setChartOptions2({
    //   scales: {
    //     yAxes: [
    //       {
    //         ticks: {
    //           max: 30,
    //           min: 0,
    //           stepSize: 2
    //         }
    //       }
    //     ]
    //   }
    // })
  }

  //lấy mã form
  useEffect(() => {
    axios.get(`/admin/review/${id}/formtype/${id1}/form/`)
      .then(res => {
        if (res.data.form) {
          setCode(res.data.form.code)
        }
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  useEffect(() => {
    if (code) {
      axios.get(`/admin/form/${code}/formrating`)
        .then(res => {
          console.log(res.data)
          let list = []
          res.data.formRatings.map(r => {
            list.push({ min: r.min_point, max: r.max_point })
          })
          setRate([...list])
          axios.get(`/admin/form/${code}/getPoints`)
            .then(res => {
              console.log(res.data)
              setPoint([...res.data.userforms])
              let dat = []
              let label = []
              list.map((x, index) => {
                index == 0 ? label.push(`< ${x.max}`) : label.push(`${x.min} - ${x.max}`)
                index == list.length - 1 ? (dat[index] = res.data.userforms.filter(y => y >= x.min && y <= x.max).length) : (dat[index] = res.data.userforms.filter(y => y >= x.min && y < x.max).length)
              })
              setChartData2({
                labels: label,
                datasets: [
                  {
                    label: 'Số GV/VC',
                    data: dat,
                    //backgroundColor:'green',
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                      'rgba(255, 205, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(153, 102, 255, 0.2)'
                    ]
                  }
                ]
              })
              setRange([...dat])
              setParicipate(participate => [res.data.userforms.length, res.data.total - res.data.userforms.length])
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [code])

  useEffect(() => {
    getChartData()
  }, [participate])


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
        body = (
          <div>
            <div style={{ width: '100%', display: 'inline-flex', justifyContent: 'space-between' }}>
              <Card className={classes.root}>
                <CardContent>
                  <Typography align='center' variant='h2' color="textSecondary" gutterBottom>
                    {isNaN(participate[0]) ? 0 : participate[0] + participate[1]}
                  </Typography>
                  <Typography align='center' variant="body2" component="p">
                    Tổng số GV/VC tham gia đánh giá
                  </Typography>
                </CardContent>
              </Card>
              <Card className={classes.root}>
                <CardContent>
                  <Typography align='center' variant='h2' color="textSecondary" gutterBottom>
                    {point.length > 0 ? Math.max(...point) : '_'}
                  </Typography>
                  <Typography align='center' variant="body2" component="p">
                    Điểm số cao nhất trong Form
                  </Typography>
                </CardContent>
              </Card>
              <Card className={classes.root}>
                <CardContent>
                  <Typography align='center' variant='h2' color="textSecondary" gutterBottom>
                    {point.length > 0 ? Math.max(...point) : '_'}
                  </Typography>
                  <Typography align='center' variant="body2" component="p">
                    Điểm số thấp nhất trong Form
                  </Typography>
                </CardContent>
              </Card>
              <Card className={classes.root}>
                <CardContent>
                  <Typography align='center' variant='h2' color="textSecondary" gutterBottom>
                    {chartData2.datasets ? chartData2.datasets[0].data[chartData2.datasets[0].data.length - 1] : '_'}
                  </Typography>
                  <Typography align='center' variant="body2" component="p">
                    Số GV/VC đạt mức cao nhất
                  </Typography>
                </CardContent>
              </Card>
            </div>
            <div style={{ margin: '10px 10px 10px 0', width: '100%' }}>
              <Paper style={{ width: '34%', padding: '10px', display: 'inline-block' }}>
                <Charts data={chartData} type={2} title={'Số GV/VC đánh giá'} />
              </Paper>
              <Paper style={{ width: '64.3%', height: '100%', float: 'right', padding: '10px', display: 'inline-block' }}>
                <Charts data={chartData2} type={0} options={chartOptions2} title={'Phân bố điểm'} />
              </Paper>
            </div>
          </div>
        )
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
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        Đợt {id} - Nhóm {id1} - Mã biểu mẫu: {code} {stage != null && (stage == 1 ? '- Thống kê chung' : '- Kết quả chi tiết')}
      </Typography>
      <MenuEvaluate />
      {stage && <Button style={{ float: 'right', marginTop: 10, minWidth: 80 }} variant="contained" onClick={() => { setStage(null) }} ><KeyboardReturnIcon /></Button>}
    </div>
  )
}

