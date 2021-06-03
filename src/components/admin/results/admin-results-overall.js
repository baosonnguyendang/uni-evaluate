import React, { useState, useEffect } from 'react';

import Charts from './admin-charts'

import axios from 'axios'

import { Link, useParams, useRouteMatch } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import ResultsDashboard from './admin-results-detailed2';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'

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
  const classes = useStyles()
  const { id, id1 } = useParams()
  const token = localStorage.getItem('token')
  const [units, setUnits] = useState([]) //ds đơn vị trong đợt đánh giá

  var { url } = useRouteMatch();

  //mã form
  const [code, setCode] = useState()

  //change tab
  const [value, setValue] = React.useState(0);

  //lấy ít data vẽ lên biểu đồ
  const [chartData, setChartData] = useState({})
  const [chartData2, setChartData2] = useState({})
  const [chartOptions2, setChartOptions2] = useState({})
  //array gom so nguoi tham gia va khong tham gia
  const [participate, setParicipate] = useState([])

  const [range, setRange] = useState([0, 0, 0, 0, 0, 0])

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
    setChartOptions2({
      scales: {
        yAxes: [
          {
            ticks: {
              max: 30,
              min: 0,
              stepSize: 2
            }
          }
        ]
      }
    })
    setChartData2({
      labels: [
        '< 50',
        '50-59',
        '60-69',
        '70-79',
        '80-89',
        '90-100'
      ],
      datasets: [
        {
          label: 'Số GV/VC',
          data: range,
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
  }

  //lấy mã form
  useEffect(() => {
    axios.get(`/admin/review/${id}/formtype/${id1}/form/`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        if (res.data.form) {
          axios.get(`/admin/form/${res.data.form.code}/getPoints`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
              console.log(res.data)
              setPoint([...res.data.userforms])
              let dat = []
              dat[0] = res.data.userforms.filter(x => x < 50).length
              dat[1] = res.data.userforms.filter(x => x >= 50 && x < 60).length
              dat[2] = res.data.userforms.filter(x => x >= 60 && x < 70).length
              dat[3] = res.data.userforms.filter(x => x >= 70 && x < 80).length
              dat[4] = res.data.userforms.filter(x => x >= 80 && x < 90).length
              dat[5] = res.data.userforms.filter(x => x >= 90).length
              setRange([...dat])
              setParicipate(participate => [res.data.userforms.length, res.data.total - res.data.userforms.length])
            })
            .catch(err => {
              console.log(err)
            })
          // setCode(res.data.form.code)
          setCode(res.data.form.code)
          //lấy các đơn vị cha nằm trong đợt đánh giá
          axios.get(`/admin/form/${res.data.form.code}/getFormDepartments`, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
              console.log(res.data)
              let temp = res.data.formDepartments.map(y => y.department_id)
              setUnits(temp)
            })
            .catch(e => console.log(e))
        }
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  useEffect(() => {
    getChartData()
  }, [participate])

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        Đợt {id} - Nhóm {id1} - Mã Form: {code} - {value == 0 ? 'Thống kê chung' : 'Kết quả chi tiết'}
      </Typography>
      {(() => {
        switch (value) {
          case 0:
            return (
              <div>
                <div style={{ width: '90%', display: 'inline-flex', justifyContent: 'space-between' }}>
                  <Card className={classes.root}>
                    <CardContent>
                      <Typography align='center' variant='h2' color="textSecondary" gutterBottom>
                        {participate[0] + participate[1]}
                      </Typography>
                      <Typography align='center' variant="body2" component="p">
                        Tổng số GV/VC tham gia đánh giá
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card className={classes.root}>
                    <CardContent>
                      <Typography align='center' variant='h2' color="textSecondary" gutterBottom>
                        {Math.max(...point)}
                      </Typography>
                      <Typography align='center' variant="body2" component="p">
                        Điểm số cao nhất trong Form
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card className={classes.root}>
                    <CardContent>
                      <Typography align='center' variant='h2' color="textSecondary" gutterBottom>
                        {Math.min(...point)}
                      </Typography>
                      <Typography align='center' variant="body2" component="p">
                        Điểm số thấp nhất trong Form
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card className={classes.root}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Word of the Day
                      </Typography>
                      <Typography variant="body2" component="p">
                        well meaning and kindly.
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
                <div style={{ margin: '10px 10px 10px 0', width: '90%' }}>
                  <Paper style={{ width: '34%', padding: '10px', display: 'inline-block' }}>
                    <Charts data={chartData} type={2} title={'Số GV/VC đánh giá'} />
                  </Paper>
                  <Paper style={{ width: '64.3%', height: '100%', float: 'right', padding: '10px', display: 'inline-block' }}>
                    <Charts data={chartData2} type={0} options={chartOptions2} title={'Phân bố điểm'} />
                  </Paper>
                </div>
                <Button onClick={() => { setValue(1) }} variant="contained" color="primary"> Nhấn vào đây để xem kết quả chi tiết</Button>
              </div>
            )
          case 1:
            return (
              <div style={{marginTop: '24px'}}>
                <ResultsDashboard/>
                <div style={{marginTop: '24px'}}>
                  <Button variant="contained" color="secondary" onClick={() => { setValue(0) }}>Trở lại trang thống kê chung</Button>
                  <Button style={{ marginLeft: 10 }} variant="contained" color="inherit" ><Link style={{ textDecoration: 'none', color:'black' }} to={`${url}/formDetailed`}>Xem chi tiết Form GV/VC</Link></Button>
                </div>
              </div>
            )
          default:
            return null
        }
      })()}
    </div>
  )
}

