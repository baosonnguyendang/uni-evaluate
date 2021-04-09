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
      numOfCriterion: 0,
      numOfCriteria: 0,
      today: Moment(),
      startDate: Moment('2021-1-13'),
      endDate: Moment('2021-12-13'),
    }
  }

  setNumOfCriterion = () => {

  }

  setNumOfCriteria = () => {

  }

  setStartDate = () => {

  }

  setEndDate = () => {
    
  }

  render() {
    let randum;
    // if (this.state.today > this.state.startDate && this.state.today < this.state.endDate) {
    if (this.state.today.isAfter(this.state.startDate) && this.state.today.isBefore(this.state.endDate)) {
      randum = <Link to='/user/evaluate/id'><Button size="small" color='secondary'>Thực hiện khảo sát</Button></Link>
    } else {
      randum = <Button size="small" color='secondary' onClick={() => alert('Ngoài thời gian thực hiện khảo sát')}>Thực hiện khảo sát</Button>
    }
    return (
      <Card style={{minWidth: '275'}} variant="outlined">
        <CardContent>
          <Typography style={{fontSize: '18'}} color="primary" gutterBottom>
            Đợt đánh giá lần 1 năm 2021
          </Typography>
          <span>[1 Tiêu chuẩn, 2 Tiêu chí] </span>
          <br />
          <span>Từ ngày: {this.state.startDate.format('DD/MM/YYYY')}</span>
          <br />
          <span>Đến ngày: {this.state.endDate.format('DD/MM/YYYY')}</span>
        </CardContent>
        <CardActions>
          {randum}
        </CardActions>
      </Card>
    )
  }
}