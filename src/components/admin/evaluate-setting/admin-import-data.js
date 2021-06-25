import React, { useState, useEffect } from 'react'

import axios from 'axios'

import { useParams } from 'react-router-dom'

import Autocomplete from '@material-ui/lab/Autocomplete';
import { Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { mapValues } from 'async';

const useStyles = makeStyles({
  dropdown: {
    marginBottom: 10,
  }
});

export default function Import(props) {
  const classes = useStyles(); //css

  const [units, setUnits] = useState([])
  const [standards, setStandards] = useState([])
  const [criteria, setCriteria] = useState([])

  const [unitChosen, setUnitChosen] = useState()
  const [standardChosen, setStandardChosen] = useState()
  const [criteriaChosen, setCriteriaChosen] = useState()

  const setChosen = (value, index) => {
    switch (index) {
      case 1:
        if (value == null) {
          setStandardChosen(null)
          setCriteriaChosen(null)
        }
        setUnitChosen(value)
        break;
      case 2:
        if (value == null) {
          setCriteriaChosen(null)
        }
        setStandardChosen(value)
        break;
      case 3:
        setCriteriaChosen(value)
        break;
      default:
        return null
    }
  }

  useEffect(() => {
    axios.get(`/admin/form/${props.fcode}/getFormDepartments`)
      .then(res => {
        console.log(res.data)
        let t = []
        res.data.formDepartments.map(unit => {
          t.push({ code: unit.department_id.department_code, name: unit.department_id.name })
        })
        t = t.filter(x => x.code != 'HDDG')
        setUnits([...t])
      })
      .catch(err => {
        console.log(err)
      })
    axios.get(`/admin/form/${props.fcode}/getFormStandard`)
      .then(res => {
        console.log(res.data)
        let temp = []
        res.data.formStandards.map(x => {
          temp.push({ code: x.standard_id.code, name: x.standard_id.name })
        })
        setStandards([...temp])
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    console.log(standardChosen)
    if (standardChosen) {
      axios.get(`/admin/form/${props.fcode}/standard/${standardChosen.code}/getFormCriteria`)
        .then(res => {
          console.log(res.data)
          let t = []
          res.data.formCriteria.map(x => {
            t.push({ code: x.criteria_id.code, name: x.criteria_id.name })
          })
          setCriteria([...t])
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [standardChosen])

  return (
    <div>
      <Typography style={{ marginBottom: 18 }} component="h3" variant="h5" color="inherit">
        Thêm dữ liệu có sẵn
      </Typography>
      <Autocomplete
        className={classes.dropdown}
        options={units}
        onChange={(event, value) => setChosen(value, 1)}
        getOptionLabel={(option) => option.name + ' (' + option.code + ')'}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Chọn Đơn vị" variant="outlined" />}
      />
      {unitChosen &&
        <Autocomplete
          className={classes.dropdown}
          options={standards}
          onChange={(event, value) => setChosen(value, 2)}
          getOptionLabel={(option) => option.name + ' (' + option.code + ')'}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Chọn Tiêu chuẩn" variant="outlined" />}
        />
      }
      {standardChosen &&
        <Autocomplete
          className={classes.dropdown}
          options={criteria}
          onChange={(event, value) => setChosen(value, 3)}
          getOptionLabel={(option) => option.name + ' (' + option.code + ')'}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Chọn Tiêu chí" variant="outlined" />}
        />
      }
      {criteriaChosen &&
        <div>
          <Button variant="contained" color="primary" onClick={() => { alert('a') }}>
            Xuất
          </Button>
          <Button style={{ marginLeft: 10 }} variant="contained" color="secondary" onClick={() => { console.log('a') }}>
            Nhập
          </Button>
        </div>
      }
    </div>
  )
}