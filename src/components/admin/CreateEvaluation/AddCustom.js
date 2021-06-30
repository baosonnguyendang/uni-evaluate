import React, { useState, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { List, Button, TextField, Typography, Box } from '@material-ui/core';

import axios from 'axios'
import {showModal} from '../../../actions/modalAction'
import { useDispatch } from 'react-redux'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useReactToPrint, ReactToPrint } from 'react-to-print';
import './style.css';

const useStyles = makeStyles((theme) => ({
  tab: {
    width: '10%'
  }
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const PrintComponent = () => {
  const classes = useStyles()
  const [value, setValue] = useState('0')
  const [form, setForm] = useState([])
  const [sumPoint, setSumPoint] = useState([0,0,0])

  useEffect(() => {
    const getFormStandard = () => {
      return axios.get(`/admin/userForm/60bb13d69eed6c00042f3e75/get`)
      .then(res => {
        console.log(res.data)
        return res.data
      })
      .catch(err => {
        console.log(err)
      })
    }
    const getFormEvaluate = () => {
      return axios.get(`/admin/userForm/60bb13d69eed6c00042f3e75/evaluation/get`)
      .then(res => {
        console.log(res.data)
        const evaluateForms = res.data.evaluateForms
        const temp = evaluateForms[0].evaluateCriteria.map(e => [])
        console.log(temp)

        const point = evaluateForms.map( ef => ef.evaluateCriteria.map( (ec, i) => {temp[i].push(ec.point)}))
        // const point = evaluateForms[0].evaluateCriteria.map(e => [e.point])
        console.log(temp)
        // điểm [[1,2,1], [1,2,1] ] 3 lv tương ứng
        return temp
      })
      .catch(err => {
        console.log(err)
      })
    }
    Promise.all([getFormStandard(), getFormEvaluate()])
      .then(res => {
        console.log(res)
        const formStandards = res[0].formStandards
        let pointAllLevel = []
        pointAllLevel = res[1]
        console.log(pointAllLevel)
        console.log(formStandards)
        setSumPoint(pointAllLevel.reduce(([a,b,c], [a1,b1,c1]) => [a+a1, b+b1, c+c1],[0,0,0])) 

        formStandards.map( (e) => {
          const pointOfStandard = pointAllLevel.slice(0,e.formCriteria.length)
          console.log(e.formCriteria.length)
          // xoá điểm đã lấy
         pointAllLevel = pointAllLevel.slice(e.formCriteria.length)
          e.point = pointOfStandard
        })

        console.log(formStandards)
        setForm(formStandards)

      })
      .catch(err => {
        console.log(err)
      })
    
  }, [])

  return (
    <div id='print' className={'root'} >
      <div style={{ margin: '0 auto', width: '23cm' }}>
        <div style={{ float: 'left', textAlign: 'center' }}>
        <strong>ĐẠI HỌC QUỐC GIA TP. HỒ CHÍ MINH</strong>
          <br />
          <strong>TRƯỜNG ĐẠI HỌC BÁCH KHOA</strong>
          <br />
          ----------
        </div>
        <div style={{ clear: 'both', height: '20px' }}></div>
        <div style={{ textAlign: 'center', width: '100%', fontWeight: 'bold', fontSize: '13pt !important', marginBottom: 25 }}>
          <b>PHIẾU ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN</b>
          <div style={{ fontSize: '95%' }}>
            Học kỳ 1 - Năm học 2020-2021
          </div>
        </div>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ width: '60%', textAlign: 'left' }}>Họ Tên: Zone Lành</td>
              <td style={{ textAlign: 'left' }}>MSSV: 1111111</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Đơn vị:</td>
            </tr>
          </tbody>
        </table>
        <div style={{ clear: 'both', height: '15px' }}></div>
        <table id="exportTable" className="table" style={{ borderCollapse: 'collapse' }} >
          <thead className={'th'}>
            <tr>
              <th rowSpan={2} style={{ verticalAlign: 'middle', width: '8%', border: '1px solid #666' }} >TT</th>
              <th rowSpan={2} style={{ verticalAlign: 'middle', width: '52%', border: '1px solid #666' }} >Nội dung đánh giá</th>
              <th rowSpan={2} style={{ verticalAlign: 'middle', width: '10%', border: '1px solid #666' }} >Điểm quy định</th>
              <th colSpan={3} style={{ border: '1px solid #666' }}>Điểm đánh giá</th>
            </tr>
            <tr>
              <th className={classes.tab} style={{ border: '1px solid #666' }}>Cá nhân tự chấm</th>
              <th className={classes.tab} style={{ border: '1px solid #666' }}>Trưởng Đơn vị</th>
              <th className={classes.tab} style={{ border: '1px solid #666' }}>HĐĐG Trường</th>
            </tr>
          </thead>
          <tbody>
            {form.map(standard => {
              return (
                <>
                  <tr key={standard._id}>
                    <td style={{ border: '1px solid #666', padding: '5px', verticalAlign: 'middle' }}><b>{standard.standard_order}</b></td>
                    <td style={{ border: '1px solid #666', padding: '5px' }}><b>{standard.standard_id.name}</b></td>
                    <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}><b>{standard.standard_point}</b></td>
                    <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}></td>
                    <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}></td>
                    <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}></td>
                  </tr>
                  {standard.formCriteria.map((criteria, i) => {
                    return (
                      <>
                        <tr key={criteria.criteria_id._id}>
                          <td style={{ border: '1px solid #666', padding: '5px', verticalAlign: 'middle' }}>{standard.standard_order}.{criteria.criteria_order}</td>
                          <td style={{ border: '1px solid #666', padding: '5px' }}>{criteria.criteria_id.name}</td>
                          <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px', verticalAlign: 'middle' }}>{criteria.point}</td>
                          <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px', verticalAlign: 'middle' }}>{standard.point[i][0]}</td>
                          <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px', verticalAlign: 'middle' }}>{standard.point[i][1]}</td>
                          <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px', verticalAlign: 'middle' }}>{standard.point[i][2]}</td>
                        </tr>
                      </>
                    )
                  })}
                </>
              )
            })}
            <tr>
              <td style={{ border: '1px solid #666', padding: '5px', textAlign: 'center' }} colSpan={2}><b>Tổng điểm</b></td>
              <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}></td>
              <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}>{sumPoint[0]}</td>
              <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}>{sumPoint[1]}</td>
              <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}>{!NaN ? null : sumPoint[2]}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function PinnedSubheaderList() {
  const classes = useStyles();
  const dispatch = useDispatch()
  const [type, setType] = React.useState('');
  const [value, setValue] = React.useState('');
  const [items, setItems] = useState([0, 1, 2, 3, 4, 5, 6, 7])
  const handleChange = (event) => {
    setType(event.target.value);
  };
  const addNewItem = (e) => {
    e.preventDefault()
    setItems([value, ...items])
  }
  const data = {
    disableEdit: false,
    name: 'Tham gia viết sách',
    code: 'TC002-A',
    max_point: null,
    base_point: 4.5,
    details: [{ name: "danh", value: "" },
    { name: "danh2", value: "10", description: "hahahaahahhahaahahahaaaaaaaaaaaaaaaaaaaaaaa" },
    { name: "danh3", value: "103" }]
  }
  const data1 = {
    disableEdit: false,
    name: 'Tham gia viết sách',
    code: 'TC002-A',
    max_point: 20,
    base_point: 4.2223,
    details: []
  }
  const print = () => {
    var w = window.open('/aaaaaaaaaaaaaaaaa')
    w.focus()
    w.print()
    // Don't try to close it until you've give the window time to register the print dialog request

  }
  function func_name() {
    var printPage = window.open(document.URL, '_blank');
    printPage.document.write('Hellow World');
    printPage.document.close();
    printPage.focus();
    printPage.print();
    // printPage.close();
  }
  function printContent(el) {
    var printPage = window.open('', '_blank');
    var restorepage = document.body.innerHTML;
    var printcontent = document.getElementById(el).innerHTML;
    printPage.document.body.innerHTML = printcontent;
    printPage.focus();
    printPage.print();

  }

  
  return (
    <div>
      <Button onClick={() => printContent('print')}>Print</Button>
      {/* <TextField onClick={() => { dispatch(showModal((data)=>console.log(data), "TIMES_MODAL", data1)) }} type="button" value={1} onMouseUp={e => e.target.blur()} style={{ width: 100 }} variant="outlined" />
  

        <TextField onClick={() => { dispatch(showModal((data)=>console.log(data), "DETAIL_MODAL",data)) }} type="button" value={ 'detail' }  onMouseUp={e => e.target.blur()} style={{width:100}} variant="outlined" /> */}
      {/* <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      /> */}
      <Box display="block">
      <PrintComponent />
      </Box>
    </div>
  );
}
