import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 18,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function Evaluation() {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="primary" gutterBottom>
          Đợt đánh giá lần 1 năm 2021
        </Typography>
        <span>[1 Tiêu chuẩn, 2 Tiêu chí] </span>
        <br/>
        <span>Từ ngày: </span>
        <br/>
        <span>Đến ngày: </span>
      </CardContent>
      <CardActions>
        <Link to='/user/evaluate/id'><Button size="small" color='secondary'>Thực hiện khảo sát</Button></Link>
      </CardActions>
    </Card>
  );
}