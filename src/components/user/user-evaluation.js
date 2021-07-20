import React, { useState, useEffect } from 'react';

import axios from 'axios'

import Moment from 'moment';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import { CardContent, LinearProgress, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';

var today = Moment()

export default function Evaluation() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  useEffect(() => {
    setLoading(true)
    axios.get('/form/review')
      .then(res => {
        console.log(res.data)
        let temp = []
        res.data.reviews.map(x => {
          let obj = { name: x.name, code: x.code, startDate: x.start_date, endDate: x.end_date, _id: x._id }
          temp.push(obj)
        })
        console.log(temp)
        setList(temp)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  const NotInTime = (
    <Button variant="contained" color="primary" size='small' onClick={() => alert('Ngoài thời gian thực hiện khảo sát')}>
      Thực hiện khảo sát
    </Button>
  )
  const redirectEvaluation = (code) => {
    history.push(`/user/evaluate/${ code }`)
  }
  return (
    <>
      {loading ? <LinearProgress style={{ position: "absolute", width: "100%" }} /> :
        <Grid container spacing={3} style={{ padding: '45px' }}>

          <Grid item sm={12} md={8}>
            <Typography variant='h6' gutterBottom >Danh sách đợt đánh giá </Typography>
            {list.map(item => {
              if (today.isAfter(item.startDate)) {
                return (
                  <Card key={item._id} style={{ minWidth: '275', marginBottom: '10px' }} variant="outlined">
                    <CardContent>
                      <Typography style={{ fontSize: '18' }} color="primary" gutterBottom>
                        {item.name}
                      </Typography>
                      <br />
                      <span>Bắt đầu: {Moment(item.startDate).format('hh:mm DD/MM/yyyy')}</span>
                      {/* .format('DD/MM/YYYY') */}
                      <br />
                      <span>Kết thúc: {Moment(item.endDate).format('hh:mm DD/MM/yyyy')}</span>
                    </CardContent>
                    <CardActions>
                      {today.isAfter(item.startDate) && today.isBefore(item.endDate) ?
                        <Button variant="contained" color="primary" size='small' onClick={() => redirectEvaluation(item.code)}>
                          Thực hiện khảo sát
                        </Button>
                        :
                        NotInTime}
                    </CardActions>
                  </Card>
                )
              }
            })}
          </Grid>
          <Grid item sm={12} md={4}>
            {/* <Grid container sm={12} md={4} flexDirection='column'>
              <Typography variant='h6' gutterBottom >Timeline</Typography>
              <div style={{ minHeight: 300 }}></div>
            </Grid> */}
            <Grid>
              <Typography variant='h6' gutterBottom >Sự kiện sắp tới</Typography>
              <div style={{ minHeight: 300 }}>
                {!list.some(item => today.isBefore(item.startDate)) && 'Không có sự kiện nào'}
                {list.map(item => {
                  if (today.isBefore(item.startDate)) {
                    return (
                      <Card key={item._id} style={{ minWidth: '275', marginBottom: '10px' }} variant="outlined">
                        <CardContent>
                          <Typography style={{ fontSize: '18' }} color="primary" gutterBottom>
                            {item.name}
                          </Typography>
                          <br />
                          <span>Bắt đầu: {Moment(item.startDate).format('hh:mm DD/MM/yyyy')}</span>
                          {/* .format('DD/MM/YYYY') */}
                        </CardContent>
                        {/* <CardActions>
                        {today.isAfter(item.startDate) && today.isBefore(item.endDate) ?
                          <Button variant="contained" color="primary" size='small' onClick={() => redirectEvaluation(item.code)}>
      
                            Thực hiện khảo sát
                          </Button>
                          :
                          NotInTime}
                      </CardActions> */}
                      </Card>)
                  }
                }
                )}
              </div>

            </Grid>
          </Grid>
        </Grid>


        /* <Typography variant='h6' gutterBottom >Danh sách đợt đánh giá </Typography>
        {list.map(item => (
          <Card key={item._id} style={{ minWidth: '275', marginBottom: '10px' }} variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: '18' }} color="primary" gutterBottom>
                {item.name}
              </Typography>
              <br />
              <span>Bắt đầu: {Moment(item.startDate).format('hh:mm DD/MM/yyyy')}</span>
              <br />
              <span>Kết thúc: {Moment(item.endDate).format('hh:mm DD/MM/yyyy')}</span>
            </CardContent>
            <CardActions>
              {today.isAfter(item.startDate) && today.isBefore(item.endDate) ?
                    <Button variant="contained" color="primary" size='small' onClick={() => redirectEvaluation(item.code)}>

                    Thực hiện khảo sát
                    </Button>
               :
                NotInTime}
            </CardActions>
          </Card>
        ))}
        <Typography variant='h6' gutterBottom >Danh sách đợt đánh giá đã qua</Typography>
        {list.map(item => (
          <Card key={item._id} style={{ minWidth: '275', marginBottom: '10px' }} variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: '18' }} color="primary" gutterBottom>
                {item.name}
              </Typography>
              <br />
              <span>Bắt đầu: {Moment(item.startDate).format('hh:mm DD/MM/yyyy')}</span>
              <br />
              <span>Kết thúc: {Moment(item.endDate).format('hh:mm DD/MM/yyyy')}</span>
            </CardContent>
            <CardActions>
              {today.isAfter(item.startDate) && today.isBefore(item.endDate) ?
                    <Button variant="contained" color="primary" size='small' onClick={() => redirectEvaluation(item.code)}>

                    Thực hiện khảo sát
                    </Button>
               :
                NotInTime}
            </CardActions>
          </Card>
              ))} */
      }





    </>
  )
}
