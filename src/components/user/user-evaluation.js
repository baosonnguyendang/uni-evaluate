import React, { useState, useEffect } from 'react';

import axios from 'axios'

import Moment from 'moment';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import { CardContent, LinearProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const token = localStorage.getItem('token')

var today = Moment()

export default function Evaluation() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    axios.get('/form/review', { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data)
        let temp = []
        res.data.reviews.map(x => {
          let obj = { name: x.name, code: x.code, startDate: x.start_date, endDate: x.end_date }
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
      {loading ? <LinearProgress style={{position:"absolute", width:"100%" }} /> : 
      <div style={{ paddingTop: '45px' }}>
        <Typography variant='h6' gutterBottom >Danh sách đợt đánh giá </Typography>
      {list.map(item => (
        <Card style={{ minWidth: '275', marginBottom: '10px' }} variant="outlined">
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
      {/* <Typography variant='h6' gutterBottom >Form đánh giá cá nhân khác</Typography>
      {list.map(item => (
        <Card style={{ minWidth: '275', marginBottom: '10px' }} variant="outlined">
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
              <Link to={'/user/evaluate/' + item.code}>
                <Button size="small" color='secondary'>
                  Thực hiện khảo sát
                  </Button>
              </Link> :
              NotInTime}
          </CardActions>
        </Card>
      ))} */}
      </div>}
      
    </>
  )
}
// export default class Evaluation extends React.Component {
//   constructor(props) {
//     super(props)

//     this.setStartDate = this.setStartDate.bind(this)
//     this.setEndDate = this.setEndDate.bind(this)

//     this.state = {
//       today: Moment(),
//       listOfEvaluation: [
//         {
//           name: 'Đợt đánh giá lần 1 năm 2021',
//           id: 1,
//           startDate: Moment('2021-1-14'),
//           endDate: Moment('2021-2-13'),
//         },
//         {
//           name: 'Đợt đánh giá lần 2 năm 2021',
//           id: 2,
//           startDate: Moment('2021-1-13'),
//           endDate: Moment('2021-12-13'),
//         }
//       ],
//     }
//   }

//   setNumOfCriterion = () => {

//   }

//   setNumOfCriteria = () => {

//   }

//   setStartDate = () => {

//   }

//   setEndDate = () => {
//     alert('danh dz')
//   }

//   componentWillMount() {
//     axios.get('/form/review', { headers: { "Authorization": `Bearer ${token}` } })
//       .then(res => {
//         console.log(res.data)
//         res.data.map(x => {

//         })
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }

//   render() {
//     // const InTime = (
//     //   <Link to={'/user/evaluate/' + '1'}>
//     //     <Button size="small" color='secondary'>
//     //       Thực hiện khảo sát
//     //     </Button>
//     //   </Link>
//     // )
//     const NotInTime = (
//       <Button size="small" color='secondary' onClick={() => alert('Ngoài thời gian thực hiện khảo sát')}>
//         Thực hiện khảo sát
//       </Button>
//     )
//     return (
//       <div style={{ paddingTop: '45px' }}>
//         <Typography variant='h6' gutterBottom >Mẫu đánh giá cá nhân</Typography>
//         {this.state.listOfEvaluation.map(item => (
//           <Card style={{ minWidth: '275', marginBottom: '10px' }} variant="outlined">
//             <CardContent>
//               <Typography style={{ fontSize: '18' }} color="primary" gutterBottom>
//                 {item.name}
//               </Typography>
//               <br />
//               <span>Từ ngày: {item.startDate.format('DD/MM/YYYY')}</span>
//               <br />
//               <span>Đến ngày: {item.endDate.format('DD/MM/YYYY')}</span>
//             </CardContent>
//             <CardActions>
//               {this.state.today.isAfter(item.startDate) && this.state.today.isBefore(item.endDate) ?
//                 <Link to={'/user/evaluate/' + item.id}>
//                   <Button size="small" color='secondary'>
//                     Thực hiện khảo sát
//                     </Button>
//                 </Link> :
//                 NotInTime}
//             </CardActions>
//           </Card>
//         ))}
//         <Typography variant='h6' gutterBottom >Mẫu đánh giá cá nhân khác</Typography>
//         {this.state.listOfEvaluation.map(item => (
//           <Card style={{ minWidth: '275', marginBottom: '10px' }} variant="outlined">
//             <CardContent>
//               <Typography style={{ fontSize: '18' }} color="primary" gutterBottom>
//                 {item.name}
//               </Typography>
//               <br />
//               <span>Từ ngày: {item.startDate.format('DD/MM/YYYY')}</span>
//               <br />
//               <span>Đến ngày: {item.endDate.format('DD/MM/YYYY')}</span>
//             </CardContent>
//             <CardActions>
//               {this.state.today.isAfter(item.startDate) && this.state.today.isBefore(item.endDate) ?
//                 <Link to={'/user/evaluate/' + item.id}>
//                   <Button size="small" color='secondary'>
//                     Thực hiện khảo sát
//                     </Button>
//                 </Link> :
//                 NotInTime}
//             </CardActions>
//           </Card>
//         ))}
//       </div>
//     )
//   }
// }