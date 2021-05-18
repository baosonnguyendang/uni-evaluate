import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Link, useRouteMatch, useParams } from 'react-router-dom'

export default function FormList(){
  const {id} = useParams()
  const token = localStorage.getItem('token')
  const { url } = useRouteMatch()

  const [list, setList] = useState([])

  useEffect(() => {
    axios.get(`/form/review/${id}/form`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        let temp = []
        console.log(res.data.formUser)
        res.data.formUser.map(x => {
          let obj = {code: x.form_id.code, name: x.form_id.name, id: x.form_id._id}
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
        <Link key={x.code} to={`${url}/${x.id}`}>{x.name}</Link>
      )
    })
  )
}