import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Card, CardActions, CardContent, Typography } from '@material-ui/core'

import { Link, useRouteMatch, useParams } from 'react-router-dom'

export default function FormList() {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const { url } = useRouteMatch()

  const [list, setList] = useState([])

  useEffect(() => {
    axios.get(`/form/review/${id}/form`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        let temp = []
        console.log(res.data.formUser)
        res.data.formUser.map(x => {
          let obj = { code: x.form_id.code, name: x.form_id.name, id: x.form_id._id }
          temp.push(obj)
        })
        setList(temp)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    list.map(x => {
      return (
        <Card style={{marginTop: '24px'}}>
          <CardContent>
            <Typography>
              Tên Form: {x.name}
            </Typography>
            <Typography>
              Mô tả:
            </Typography>
          </CardContent>
          <CardActions style={{paddingLeft: '16px'}}>
            <Link key={x.code} to={`${url}/${x.id}`}>Bấm vào đây để thực hiện đánh giá..</Link>
          </CardActions>
        </Card>
      )
    })
  )
}