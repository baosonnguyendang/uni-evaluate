import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import '../../index.css'

import sz from '../../img/sz.jpg'

const useStyles = makeStyles({
  root: {
    margin: '0 auto',
    maxWidth: 500,
  },
});

export default function Info() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="300"
          image={sz}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" align='center' style={{borderBottom: '1px solid #f4f4f4'}}>
            Thông tin cá nhân
          </Typography>
          <div>
            <table id='user-info-table'>
              <tbody>
                <tr>
                  <th>Họ tên:</th>
                  <td>Dominik Szoboszlai</td>
                </tr>
                <tr>
                  <th>Ngày sinh:</th>
                  <td>25/10/2000</td>
                </tr>
                <tr>
                  <th>Mã số:</th>
                  <td>17</td>
                </tr>
                <tr>
                  <th>Đơn vị:</th>
                  <td>RB Leipzig</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </CardActionArea>
      {/* <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions> */}
    </Card>
  );
}