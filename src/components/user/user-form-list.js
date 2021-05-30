import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Card, CardActions, CardContent, Typography, Button, Container, LinearProgress } from '@material-ui/core'

import { Link, useRouteMatch, useParams } from 'react-router-dom'
import { PermDeviceInformationSharp } from '@material-ui/icons';

export default function FormList() {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const { url } = useRouteMatch()

  const [list, setList] = useState([])
  const [isHeadUnit, setIsHeadUnit] = useState(false)
  const [unit, setUnit] = useState()
  const [listH, setListH] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchHeadForm = () => {
    return axios.get(`/user/review/${id}/head`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data)
        if (res.data.formDepartment.length > 0) {
          setIsHeadUnit(true)
          let t = []
          res.data.formDepartment.map(x => {
            t.push({ unit: x.department_id.department_code, form: x.form_id.code })
          })
          console.log(t)
          //setUnit(res.data.formDepartment[0].department_id.department_code)
          setUnit([...t])
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const fetchForm = () => {
    return axios.get(`/form/review/${id}/form`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        let temp = []
        let t3mp = []
        console.log(res.data.formUsers)
        res.data.formUsers.map(x => {
          let obj = { code: x.form_id.code, name: x.form_id.name, id: x.userForm._id, level: x.department_form_id.level, department: x.department_form_id.department_id.department_code }
          if (!temp.some(y => y.code == obj.code)) {
            temp.push(obj)
          }
          else {
            t3mp.push(obj)
          }
          //temp.push(obj)
          // if (x.department_form_id.level < 3) {
          //   let obj = { code: x.form_id.code, name: x.form_id.name, id: x.userForm._id }
          //   temp.push(obj)
          // }
          // else {
          //   let obj = { code: x.form_id.code, name: x.form_id.name, id: x.userForm._id }
          //   t3mp.push(obj)
          // }
        })
        console.log(temp)
        console.log(t3mp)
        setList([...temp])
        setListH([...t3mp])
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchForm(), fetchHeadForm()])
      .then((res) => {
        setLoading(false)
      })

  }, [])

  return (
    <>
      {loading ? <LinearProgress style={{ position: "absolute", width: "100%" }} /> :
        <Container>
          <Typography variant="h5" component="h2" style={{ marginTop: '24px' }}>
            Danh sách các Form đánh giá:
        </Typography>
          {
            list.map(x => {
              console.log(list)
              return (
                x.level < 3 ? (
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
                        <Link style={{ textDecoration: 'none', color: 'white' }} key={x.code} to={`${url}/${x.id}`}>Đánh giá cá nhân</Link>
                      </Button>
                      {unit.length > 0 && unit.some(y => y.unit == x.department) &&
                        <Button variant='contained' color='secondary'>
                          <Link style={{ textDecoration: 'none', color: 'white' }} key={x.code} to={`${url}/${x.code}/${x.department}`}>Đánh giá với tư cách trưởng đơn vị</Link>
                        </Button>}
                      {listH > 0 && listH.some(y => y.code == x.code) &&
                        <Button variant='contained' color='default'>
                          <Link style={{ textDecoration: 'none', color: 'black' }} key={x.code} to={`${url}/${x.code}/hddg`}>Đánh giá với tư cách HDDG</Link>
                        </Button>
                      }
                    </CardActions>
                  </Card>
                ) : (
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
                      <Button variant='contained' color='default'>
                        <Link style={{ textDecoration: 'none', color: 'black' }} key={x.code} to={`${url}/${x.code}/hddg`}>Đánh giá với tư cách HDDG</Link>
                      </Button>
                    </CardActions>
                  </Card>
                )
              )
            })
          }
        </Container>}
    </>
  )
}