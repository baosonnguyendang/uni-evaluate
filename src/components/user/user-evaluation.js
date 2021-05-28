import React, { useState, useEffect } from 'react';

import axios from 'axios'

import Moment from 'moment';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import { CardContent, LinearProgress, Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';


var today = Moment()

export default function Evaluation() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')
  console.log(token)
  useEffect(() => {
    setLoading(true)
    axios.get('/form/review', { headers: { "Authorization": `Bearer ${token}` } })
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
    <Button size="small" color='secondary' onClick={() => alert('Ngoài thời gian thực hiện khảo sát')}>
      Thực hiện khảo sát
    </Button>
  )

  return (
    <>
      {loading ? <LinearProgress style={{ position: "absolute", width: "100%" }} /> :
        <Container style={{ paddingTop: '45px' }}>
          <Typography variant='h6' gutterBottom >Danh sách đợt đánh giá </Typography>
          {list.map(item => (
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
                  <Link to={'/user/evaluate/' + item.code}>
                    <Button size="small" color='secondary'>
                      Thực hiện khảo sát
                </Button>
                  </Link> :
                  NotInTime}
              </CardActions>
            </Card>
          ))}
        </Container>}
    </>
  )
}
