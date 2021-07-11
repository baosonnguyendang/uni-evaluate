import React, { useState, useEffect } from 'react';
import {  makeStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip, Box } from '@material-ui/core';
import PrintIcon from '@material-ui/icons/Print';

import axios from 'axios'

import './styles.css';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useParams } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  tab: {
    width: '10%'
  }
}));



const PrintComponent = (props) => {
  const classes = useStyles()

  const [name, setName] = useState()
  const { id } = useParams()

  useEffect(() => {
    axios.get(`/review/${id}`)
      .then(res => {
        setName(res.data.review.name)
        props.setBool(true)
      })
    // const getFormStandard = () => {
    //   return axios.get(`/form/${props.userForm}/v2`)
    //     .then(res => {
    //       console.log(res.data)
    //       setInfo({ name: res.data.user.lastname + ' ' + res.data.user.firstname, id: res.data.user.staff_id, department: res.data.department.name, form: res.data.form.name })
    //       return res.data
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // }
    // const getFormEvaluate = () => {
    //   return axios.get(`/form/${props.userForm}/evaluation/get`)
    //     .then(res => {
    //       console.log(res.data)
    //       const evaluateForms = res.data.evaluateForms
    //       const temp = evaluateForms[0].evaluateCriteria.map(e => [])
    //       console.log(temp)

    //       const point = evaluateForms.map(ef => ef.evaluateCriteria.map((ec, i) => { temp[i].push(ec.point) }))
    //       // const point = evaluateForms[0].evaluateCriteria.map(e => [e.point])
    //       console.log(temp)
    //       // điểm [[1,2,1], [1,2,1] ] 3 lv tương ứng
    //       return temp
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // }
    // Promise.all([getFormStandard(), getFormEvaluate()])
    //   .then(res => {
    //     console.log(res)
    //     const formStandards = res[0].formStandards
    //     let pointAllLevel = []
    //     pointAllLevel = res[1]
    //     console.log(pointAllLevel)
    //     console.log(formStandards)
    //     setSumPoint(pointAllLevel.reduce(([a, b, c], [a1, b1, c1]) => [a + a1, b + b1, c + c1], [0, 0, 0]))

    //     formStandards.map((e) => {
    //       const pointOfStandard = pointAllLevel.slice(0, e.formCriteria.length)
    //       console.log(e.formCriteria.length)
    //       // xoá điểm đã lấy
    //       pointAllLevel = pointAllLevel.slice(e.formCriteria.length)
    //       e.point = pointOfStandard
    //     })

    //     console.log(formStandards)
    //     setForm(formStandards)
    //     props.setBool(true)
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })

  }, [])

  return (
    <div>
      {props.info && props.form && (
        <div id='print' className={'root'} style={{ display: 'none' }} >
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
              <b>PHIẾU ĐÁNH GIÁ KẾT QUẢ GIẢNG VIÊN/VIÊN CHỨC</b>
              <div style={{ fontSize: '95%' }}>
                {name}
              </div>
            </div>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ width: '60%', textAlign: 'left' }}>Họ Tên: {props.info.name}</td>
                  <td style={{ textAlign: 'left' }}>MSVC: {props.info.id}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'left' }}>Đơn vị: {props.info.unit}</td>
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
                  <th style={{ border: '1px solid #666', width: '10%' }}>Cá nhân tự chấm</th>
                  <th style={{ border: '1px solid #666', width: '10%' }}>Trưởng Đơn vị</th>
                  <th style={{ border: '1px solid #666', width: '10%' }}>HĐĐG Trường</th>
                </tr>
              </thead>
              <tbody>
                {props.form.map(standard => {
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
                      {standard.formCriteria.map(criteria => {
                        return (
                          <>
                            <tr>
                              <td style={{ border: '1px solid #666', padding: '5px', verticalAlign: 'middle' }}>{standard.standard_order}.{criteria.criteria_order}</td>
                              <td style={{ border: '1px solid #666', padding: '5px' }}>{criteria.criteria_id.name}</td>
                              <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}>{criteria.point}</td>
                              <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}>
                                {props.point && props.data[0] && props.data[0].some(x => x.name == criteria.criteria_id.code) && props.data[0].find(x => x.name == criteria.criteria_id.code).value}
                              </td>
                              <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}>
                                {props.point2 && props.data[1] && props.data[1].some(x => x.name == criteria.criteria_id.code) && props.data[1].find(x => x.name == criteria.criteria_id.code).value}
                              </td>
                              <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}>
                                {props.point3 && props.data[2] && props.data[2].some(x => x.name == criteria.criteria_id.code) && props.data[2].find(x => x.name == criteria.criteria_id.code).value}
                              </td>
                            </tr>
                          </>
                        )
                      })}
                    </>
                  )
                })}
                <tr>
                  <td style={{ border: '1px solid #666', padding: '5px', textAlign: 'center' }} colSpan={3}><b>Tổng điểm</b></td>
                  <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}><b>{props.point}</b></td>
                  <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}><b>{props.point2}</b></td>
                  <td style={{ textAlign: 'center', border: '1px solid #666', padding: '5px' }}><b>{props.point3}</b></td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #666', padding: '5px', textAlign: 'center' }} colSpan={6}><b>Xếp loại:</b> {props.rating ? props.rating : 'Chưa có'}</td>
                </tr>
              </tbody>
            </table>
            <table style={{ width: '100%', marginTop: 10 }}>
              <tbody>
                <tr>
                  <td style={{ width: '33%' }}></td>
                  <td style={{ width: '33%' }}></td>
                  <td style={{ width: '33%', textAlign: 'center' }}>{`Ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`}</td>
                </tr>
                <tr>
                  <td style={{ width: '33%', textAlign: 'center' }}><b>{props.level == 3 && 'Hội đồng Đánh giá'}</b></td>
                  <td style={{ width: '33%', textAlign: 'center' }}><b>{props.level >= 2 && 'Trưởng Đơn vị'}</b></td>
                  <td style={{ width: '33%', textAlign: 'center' }}><b>Giảng viên/Viên chức</b></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PinnedSubheaderList(props) {

  function printContent(el) {
    var printPage = window.open('', '_blank');
    var printcontent = document.getElementById(el).innerHTML;
    printPage.document.body.innerHTML = printcontent;
    printPage.focus();
    printPage.print();
    //printPage.close();
  }

  const [bool, setBool] = useState(false)

  return (
    <div>
      {/* <Button onClick={() => printContent('print')}>Print</Button> */}
      {bool ? (
        <Tooltip title='In Biểu mẫu' displayPrint="none" component={Box}>
          <IconButton onClick={() => printContent('print')}>
            <PrintIcon />
          </IconButton>
        </Tooltip>
      ) : <CircularProgress />}
      
      <PrintComponent rating={props.rating} setBool={setBool} form={props.form} data={props.data} info={props.info} level={props.level} point={props.point} point2={props.point2} point3={props.point3} />
    </div>
  );
}
