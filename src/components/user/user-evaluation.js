import React from 'react';

import Moment from 'moment';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Link } from 'react-router-dom';

export default class Evaluation extends React.Component {
  constructor(props) {
    super(props)

    this.setNumOfCriterion = this.setNumOfCriterion.bind(this)
    this.setNumOfCriteria = this.setNumOfCriteria.bind(this)
    this.setStartDate = this.setStartDate.bind(this)
    this.setEndDate = this.setEndDate.bind(this)

    this.state = {
      today: Moment(),
      listOfEvaluation: [
        {
          name: 'Đợt đánh giá lần 1 năm 2021',
          id: 1,
          numOfCriterion: 5,
          numOfCriteria: 11,
          startDate: Moment('2021-1-14'),
          endDate: Moment('2021-2-13'),
        },
        {
          name: 'Đợt đánh giá lần 2 năm 2021',
          id: 2,
          numOfCriterion: 0,
          numOfCriteria: 0,
          startDate: Moment('2021-1-13'),
          endDate: Moment('2021-12-13'),
        }
      ],
    }
  }

  setNumOfCriterion = () => {

  }

  setNumOfCriteria = () => {

  }

  setStartDate = () => {

  }

  setEndDate = () => {
    alert('danh dz')
  }

  render() {
    // const InTime = (
    //   <Link to={'/user/evaluate/' + '1'}>
    //     <Button size="small" color='secondary'>
    //       Thực hiện khảo sát
    //     </Button>
    //   </Link>
    // )
    const NotInTime = (
      <Button size="small" color='secondary' onClick={() => alert('Ngoài thời gian thực hiện khảo sát')}>
        Thực hiện khảo sát
      </Button>
    )
    return (
      <div style={{ paddingTop: '45px' }}>
        {this.state.listOfEvaluation.map(item => (
          <Card style={{ minWidth: '275', marginBottom: '10px' }} variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: '18' }} color="primary" gutterBottom>
                {item.name}
              </Typography>
              <span>[{item.numOfCriteria} Tiêu chuẩn, {item.numOfCriterion} Tiêu chí] </span>
              <br />
              <span>Từ ngày: {item.startDate.format('DD/MM/YYYY')}</span>
              <br />
              <span>Đến ngày: {item.endDate.format('DD/MM/YYYY')}</span>
            </CardContent>
            <CardActions>
              {this.state.today.isAfter(item.startDate) && this.state.today.isBefore(item.endDate) ?
                <Link to={'/user/evaluate/' + item.id}>
                  <Button size="small" color='secondary'>
                    Thực hiện khảo sát
                    </Button>
                </Link> :
                NotInTime}
            </CardActions>
          </Card>
        ))}
      </div>
    )
  }
}