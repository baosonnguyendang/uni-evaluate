import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Card, CardActions, CardContent, Typography, Button, Container, LinearProgress } from '@material-ui/core'

import { Link, useRouteMatch, useParams } from 'react-router-dom'

export default function FormList() {
  const { id } = useParams()
  const { url } = useRouteMatch()

  const [list, setList] = useState([])
  const [unit, setUnit] = useState([]) //ds cac don vi lam truong
  const [listH, setListH] = useState([])
  const [loading, setLoading] = useState(false)
  const [headH, setHeadH] = useState(false)

  const fetchHeadForm = () => {
    return axios.get(`/user/review/${id}/head`)
      .then(res => {
        console.log(res.data)
        // if (res.data.formDepartment.some(x => x.department_id.department_code == 'HDDG')) {
        //   setHeadH(true)
        // }
        if (res.data.formDepartment.length > 0) {
          let t = []
          res.data.formDepartment.map(x => {
            // if (x.department_id.department_code != 'HDDG') {
            //   t.push({ unit: x.department_id.department_code, form: x.form_id.code })
            // }
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
    return axios.get(`/form/review/${id}/form`)
      .then(res => {
        let temp = []
        let t3mp = []
        if (res.data.formUsers.some(x => x.department_form_id.level == 3)) {
          setHeadH(true)
        } // xem co nam trong hddg ko
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
            Danh sách các biểu mẫu đánh giá:
          </Typography>
          {
            list.map(x => {
              console.log(list)
              console.log(unit)
              return (
                x.level < 3 ? (
                  <Card key={x.code} style={{ marginTop: '24px' }}>
                    <CardContent>
                      <Typography variant="h6" component="h5">
                        Tên biểu mẫu: {x.name}
                      </Typography>
                      <Typography>
                        Mã biểu mẫu: {x.code}
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
                      {listH.length > 0 && listH.some(y => y.code == x.code) && headH &&
                        ((unit.some(y => y.unit == 'HDDG') && unit.some(z => z.form == x.code)) ? (
                          <Button variant='contained' color='default'>
                            <Link style={{ textDecoration: 'none', color: 'black' }} key={x.code} to={`${url}/${x.code}/hddg`}>Đánh giá với tư cách HDDG</Link>
                          </Button>
                        ) : (
                          <Button variant='contained' color='default'>
                            <Link style={{ textDecoration: 'none', color: 'black' }} key={x.code} to={`${url}/${x.code}/hddg`}>Xem với tư cách HDDG</Link>
                          </Button>
                        ))
                      }
                    </CardActions>
                  </Card>
                ) : (
                  headH &&
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
                      {(unit.some(y => y.unit == 'HDDG') && unit.some(z => z.form == x.code)) ? (
                        <Button variant='contained' color='default'>
                          <Link style={{ textDecoration: 'none', color: 'black' }} key={x.code} to={`${url}/${x.code}/hddg`}>Đánh giá với tư cách HDDG</Link>
                        </Button>
                      ) : (
                        <Button variant='contained' color='default'>
                          <Link style={{ textDecoration: 'none', color: 'black' }} key={x.code} to={`${url}/${x.code}/hddg`}>Xem với tư cách HDDG</Link>
                        </Button>
                      )}
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