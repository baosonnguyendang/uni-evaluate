import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { List, Button, TextField, Typography } from '@material-ui/core';

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
const useStyles = makeStyles((theme) =>
  createStyles({


  }),
);
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
  return (<div id='print' className={'root'} >
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 258 }}>
      <h5 style={{ fontWeigth: 300 }}><b>Đại học quốc gia TP.HCM</b></h5>
      <h5><b>Trường Đại học bách khoa{value}</b></h5>
      -----------
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center", margin: '30px 0', marginBottom: 50 }}>

      <h5><b>PHIẾU ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN</b></h5>
      <h5><b>Học kỳ 1 Năm học 2020-2021</b></h5>
    </div>
    <div style={{ width: "60%", display: 'inline-block' }}>Họ tên: Trần Bình Cát Luận</div>
    MSSV: 16030441
    <div style={{ width: "60%", display: 'inline-block' }}>Lớp: NCDUDPM10B</div>
    Khoa/viện: Khoa Công nghệ Thông tin
    <table id="exportTable" className="table" >
      <thead className={'th'}>
        <tr>
          <th rowspan={2} className={'th__stt'}>Tiêu chuẩn/Tiêu chí</th>
          <th rowspan={2} className={'th_content'}>Nội dung đánh giá</th>
          <th colspan={3} >Điểm đánh giá</th>

        </tr>
        <tr>
          <th className={'th_evaluation'}>Phần mềm đánh giá</th>
          <th className={'th_evaluation'}>Sinh viên tự đánh giá</th>
          <th className={'th_evaluation'}>Lớp đánh giá</th>
        </tr>
      </thead>
      <tbody>
        <tr className={'tr'}>
          <td>1</td>
          <td>Đánh giá về ý thức tham gia học tập (tối đa 20 điểm)</td>
          <td>13</td>
          <td></td>
          <td>2</td>
        </tr>
        <tr className={'tr'}>
          <td>1.1</td>
          <td>Ý thức và thái độ trong học tập (10 điểm)</td>
          <td>10</td>
          <td></td>
          <td></td>
        </tr>
        <tr className={'tr'}>
          <td>1.1.1</td>
          <td>Đi học đầy đủ đúng giờ; thái độ học tập tích cực</td>
          <td>10</td>
          <td></td>
          <td></td>
        </tr>
        <tr className={'tr'}>
          <td>1.2</td>
          <td>Ý thức và thái độ tham gia các cuộc thi kỳ thi (3 điểm)</td>
          <td>3</td>
          <td></td>
          <td></td>
        </tr>
        <tr className={'tr'}>
          <td>1.2.1</td>
          <td>Ý thức và thái độ tham gia các cuộc thi, kỳ thi</td>
          <td>3</td>
          <td></td>
          <td></td>
        </tr>
        <tr className={'tr'}>
          <td>1.3</td>
          <td>Kết quả học tập (9 điểm)</td>
          <td>5</td>
          <td></td>
          <td></td>
        </tr>
        <tr className={'tr'}>
          <td>1.3.1</td>
          <td>Kết quả học tập(KQHT:)</td>
          <td>0</td>
          <td></td>
          <td></td>
        </tr>
        <tr className={'tr'}>
          <td colspan={2} style={{ textAlign: 'center' }}>Tổng điểm</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>

  </div>)
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
    max_point: 20,
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
  

        <TextField onClick={() => { dispatch(showModal((data)=>console.log(data), "DETAIL_MODAL",data)) }} type="button" value={1}  onMouseUp={e => e.target.blur()} style={{width:100}} variant="outlined" /> */}
      {/* <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      /> */}
      <PrintComponent />
    </div>
  );
}
