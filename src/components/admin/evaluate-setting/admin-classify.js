import React, { useState, useEffect } from 'react'

import axios from 'axios'

import Loading from '../../common/CircleLoading'

import { Typography } from '@material-ui/core';

function Classify(props) {

  const [loading, setLoading] = useState(false)

  return (
    <div>
      {loading ? <Loading /> : (
        <div>
          <Typography component="h3" variant="h5" color="inherit">
            Cấu hình xếp loại đánh giá
          </Typography>
          <p>{props.fcode}</p>
        </div>
      )}
    </div>
  )
}

export default Classify
