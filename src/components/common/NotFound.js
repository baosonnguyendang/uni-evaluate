import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core'

const NotFound = () => (
  <div style={{
    position: 'absolute',
    top: '50%',
    right: '50%',
    transform: 'translate(50%, -70%)',
    textAlign: 'center'
  }}>
    <br />
    <Typography variant="h2" style={{ fontSize: '12rem' }} >
      404
    </Typography>
    <Typography variant="h3" >
      Không tìm thấy trang
    </Typography>
    <br />

    <Typography variant='h5' component={Link} to="/">
      Trở lại trang chủ
    </Typography>
  </div>
)

export default NotFound;