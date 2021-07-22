import React, { useState, useEffect } from 'react'

import axios from 'axios'

import { Tooltip, IconButton, Box } from '@material-ui/core'
import PrintIcon from '@material-ui/icons/Print';

import { useParams } from 'react-router-dom'

export default function PrintList(props) {
  const { id } = useParams()

  const [name, setName] = useState('')

  useEffect(() => {
    // console.log(props.data)
    axios.get(`/review/${ id }`)
      .then(res => {
        setName(res.data.review.name)
      })
  }, [])

  function printContent(el) {
    var printPage = window.open('', '_blank');
    var printcontent = document.getElementById(el).innerHTML;
    printPage.document.body.innerHTML = printcontent;
    printPage.focus();
    printPage.print();
    printPage.close();
  }

  const PrintComponent = () => {
    return (
      <div id='print' style={{ display: 'none' }}>
        <div style={{ margin: '0 auto', width: '23cm' }}>
          <div style={{ float: 'left', textAlign: 'center' }}>
            ĐẠI HỌC QUỐC GIA TP. HỒ CHÍ MINH
            <br />
            <strong>TRƯỜNG ĐẠI HỌC BÁCH KHOA</strong>
            <br />
            ----------
          </div>
          <div style={{ clear: 'both', height: '20px' }}></div>
          <div style={{ textAlign: 'center', width: '100%', fontSize: '13pt !important', marginBottom: 25 }}>
            <b>BẢNG KẾT QUẢ ĐÁNH GIÁ GIẢNG VIÊN/VIÊN CHỨC TRỰC THUỘC</b>
            <div style={{ fontSize: '95%' }}>
              {name}
            </div>
          </div>
        </div>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ width: '60%', textAlign: 'left' }}>Đơn vị: {props.unit.department_id.name}</td>
              <td style={{ width: '60%', textAlign: 'left' }}>Trưởng Đơn vị: {`${ props.unit.head.lastname } ${ props.unit.head.firstname }`}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'left' }}>Mã Đơn vị: {props.unit.department_id.department_code}</td>
              <td style={{ textAlign: 'left' }}>Mã Trưởng Đơn vị: {props.unit.head.staff_id}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ clear: 'both', height: '15px' }}></div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ width: '17%', padding: 5, border: '1px solid #666', textAlign: 'left' }}>Mã GV/VC</th>
              <th style={{ width: '23%', padding: 5, border: '1px solid #666', textAlign: 'left' }}>Họ và tên lót GV/VC</th>
              <th style={{ width: '12%', padding: 5, border: '1px solid #666', textAlign: 'left' }}>Tên GV/VC</th>
              <th style={{ width: '12%', padding: 5, border: '1px solid #666' }}>Điểm cá nhân đánh giá</th>
              <th style={{ width: '12%', padding: 5, border: '1px solid #666' }}>Điểm Trưởng Đơn vị đánh giá</th>
              <th style={{ width: '12%', padding: 5, border: '1px solid #666' }}>Điểm HĐĐG đánh giá</th>
              <th style={{ width: '12%', padding: 5, border: '1px solid #666' }}>Xếp loại</th>
            </tr>
          </thead>
          <tbody>
            {props.data.map((x, i) => {
              return (
                <tr key={i}>
                  <td style={{ border: '1px solid #666', padding: 5 }}>{x.code}</td>
                  <td style={{ border: '1px solid #666', padding: 5 }}>{x.lname}</td>
                  <td style={{ border: '1px solid #666', padding: 5 }}>{x.fname}</td>
                  <td style={{ border: '1px solid #666', padding: 5, textAlign: 'center' }}>{x.point[0] == ' -' ? '' : x.point[0]}</td>
                  <td style={{ border: '1px solid #666', padding: 5, textAlign: 'center' }}>{x.point[1] == ' -' ? '' : x.point[1]}</td>
                  <td style={{ border: '1px solid #666', padding: 5, textAlign: 'center' }}>{x.point[2] == ' -' ? '' : x.point[2]}</td>
                  <td style={{ border: '1px solid #666', padding: 5, textAlign: 'center' }}>{x.rating ? x.rating : ''}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <table style={{ width: '100%', marginTop: 10 }}>
          <tbody>
            <tr>
              <td style={{ width: '70%' }}></td>
              <td style={{ width: '30%', textAlign: 'center' }}>{`Ngày ${ new Date().getDate() } tháng ${ new Date().getMonth() + 1 } năm ${ new Date().getFullYear() }`}</td>
            </tr>
            <tr>
              <td style={{ width: '70%', textAlign: 'center' }}></td>
              <td style={{ width: '30%', textAlign: 'center' }}><b>Trưởng Đơn vị</b></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <Tooltip title='In Danh sách' displayPrint="none" component={Box}>
        <IconButton onClick={() => printContent('print')}>
          <PrintIcon />
        </IconButton>
      </Tooltip>
      <PrintComponent />
    </div>
  );
}