import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Card, CardActions, CardContent, Typography, Button } from '@material-ui/core'

import { Link, useRouteMatch, useParams } from 'react-router-dom'

export default function FormList() {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const { url } = useRouteMatch()

  const [list, setList] = useState([])
  const [isHeadUnit, setIsHeadUnit] = useState(false)
  const [unit, setUnit] = useState()

  useEffect(() => {
    console.log(id)
    axios.get(`/user/review/${id}/head`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data)
        if (res.data.formDepartment.length > 0) {
          setIsHeadUnit(true)
          setUnit(res.data.formDepartment[0].department_id.department_code)
        }
      })
      .catch(err => {
        console.log(err)
      })
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
    <div>
      <Typography variant="h5" component="h2" style={{ marginTop: '24px' }}>
        Danh sách các Form đánh giá:
      </Typography>
      {
        list.map(x => {
          return (
            <Card key={x.code} style={{ marginTop: '24px' }}>
              <CardContent>
                <Typography variant="h6" component="h5">
                  Tên Form: {x.name}
                </Typography>
                <Typography>
                  Mã Form: {x.code}
                </Typography>
              </CardContent>
              <CardActions style={{ paddingLeft: '16px' }}>
                <Button variant='contained' color='primary'>
                  <Link style={{ textDecoration: 'none', color: 'white' }} key={x.code} to={`${url}/${x.code}`}>Đánh giá cá nhân</Link>
                </Button>
                {isHeadUnit &&
                  <Button variant='contained' color='secondary'>
                    <Link style={{ textDecoration: 'none', color: 'white' }} key={x.code} to={`${url}/${x.code}/${unit}`}>Đánh giá với tư cách trưởng đơn vị</Link>
                  </Button>}
              </CardActions>
            </Card>
          )
        })
      }
    </div>
  )
}