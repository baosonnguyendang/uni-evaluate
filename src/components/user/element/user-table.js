// import React, { useState, useEffect } from 'react'
// import {
//   TableContainer, Table,
//   TableHead, TableRow, TableCell,
//   TableBody, makeStyles, Paper, Grid,
//   Radio, Button, Checkbox,
//   LinearProgress
// } from "@material-ui/core";

// import axios from 'axios'

// import { useParams } from 'react-router-dom'

// const useStyles = makeStyles({
//   table: {
//     minWidth: 700,
//   },
// });

// const TableEvaluation = () => {
//   const classes = useStyles();
//   const [loading, setLoading] = useState(false)
//   // const [data, setData] = useState({})
//   const token = localStorage.getItem('token')
//   const { id1 } = useParams()

//   const [data, setData] = useState([]) //data đầu vào
//   const [sent, setSent] = useState([]) //data đầu ra

//   console.log(id1)

//   useEffect(() => {
//     setLoading(true)
//     axios.get(`/form/v2/${id1}`, { headers: { "Authorization": `Bearer ${token}` } })
//       .then(res => {
//         console.log(res.data.formStandards)
//         setData(res.data.formStandards)
//         setLoading(false)
//       })
//       .catch(err => {
//         console.log(err)
//         setLoading(false)
//       })
//     let temp = []
//     data.map(standard => {
//       let o = {name: standard.standard_id.code, list: []}
//       standard.formCriteria.map(criteria => {
//         let obj = { name: criteria.criteria_id.code, value: criteria.criteria_id.type == 'checkbox' ? 0 : null }
//         o.list.push(obj)
//       })
//       temp.push(o)
//     })
//     setSent(temp)
//   }, [])


//   const handleCheck = (event) => {
//     // setChecked(event.target.checked);
//     let temp = sent.slice()

//     temp.find(x => x.list.some(y => y.name === event.target.name)).list.find(z => z.name === event.target.name).value = event.target.checked ? event.target.value : 0
//     console.log(temp)
//     setSent(temp)
//     // console.log('name: ' + event.target.name + ', điểm: ' + event.target.value + ', checked:' + event.target.checked)
//   };

//   const handleCheckRadio = (event) => {
//     let temp = sent.slice()
//     temp.find(x => x.list.some(y => y.name === event.target.name)).list.find(z => z.name === event.target.name).value = event.target.value
//     console.log(temp)
//     setSent(temp)
//   }

//   const sendNude = () => {
//     let list = []
//     sent.filter(x => x.list.some(y => y.value === null)).map(x => {
//       list.push(data.find(y => y.standard_id.code === x.name).standard_id.name) 
//     })
//     if (list.length === 0){
//       axios.post(`/user/submitForm`, sent, { headers: { "Authorization": `Bearer ${token}` } })
//       .then(res => {
//         alert(res)
//       })
//       .catch(err => {
//         alert(err)
//       })
//     }
//     else {
//       let noti = 'Các tiêu chuẩn sau chưa hoàn thành đánh giá:'
//       list.map(x => noti += '\n' + x)
//       alert(noti)
//     }
//   }

//   return (
//     < >
//       { loading ? <LinearProgress style={{ position: "absolute", width: "100%" }} /> : (
//         <Grid container xs={12} justify='center' style={{ margin: '45px 0px' }}>
//           <TableContainer component={Paper} style={{ marginBottom: '30px' }}>
//             <Table className={classes.table} >
//               <TableHead>
//                 <TableRow>
//                   <TableCell rowSpan={2}>Tiêu chuẩn/ Tiêu chí</TableCell>
//                   <TableCell rowSpan={2}>Nội dung</TableCell>
//                   <TableCell rowSpan={2}>Điểm quy định</TableCell>
//                   <TableCell colSpan={3} align="center">Điểm đánh giá</TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell align="center">Cá nhân tự chấm</TableCell>
//                   <TableCell align="center">Trưởng bộ môn</TableCell>
//                   <TableCell align="center">Hội đồng nhà trường</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {data.map(standard => (
//                   <>
//                     <TableRow>
//                       <TableCell>{standard.standard_order}</TableCell>
//                       <TableCell><b>{standard.standard_id.name}</b></TableCell>
//                       <TableCell>{standard.standard_point}</TableCell>
//                       <TableCell />
//                       <TableCell />
//                       <TableCell />
//                     </TableRow>

//                     {standard.formCriteria.map((criteria, index) => (
//                       <>
//                         <TableRow>
//                           <TableCell rowSpan={criteria.options.length + 1} >{standard.standard_order}.{criteria.criteria_order}</TableCell>
//                           <TableCell><b>{criteria.criteria_id.name}</b></TableCell>
//                           <TableCell>{criteria.point}</TableCell>
//                           <TableCell align='center'>{criteria.options.length > 0 ? null : <Checkbox onChange={handleCheck} name={criteria.criteria_id.code} value={criteria.point} />}</TableCell>
//                           <TableCell></TableCell>
//                           <TableCell></TableCell>
//                         </TableRow>
//                         {criteria.options.map((option, index) => (
//                           <TableRow>
//                             <TableCell>{option.name}</TableCell>
//                             <TableCell>{option.max_point}</TableCell>
//                             <TableCell align='center' colSpan={1}><input onChange={handleCheckRadio} type="radio" name={criteria.criteria_id.code} value={option.max_point} /></TableCell>
//                             <TableCell align='center' colSpan={1}></TableCell>
//                             <TableCell align='center' colSpan={1}></TableCell>
//                           </TableRow>
//                         ))}
//                       </>
//                     ))}
//                   </>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <Button variant="contained" color="primary" onClick={sendNude}>
//             Hoàn thành đánh giá
//           </Button>
//         </Grid>
//       )}

//     </>

//   )
// }

// export default TableEvaluation

import React, {useState, useEffect} from 'react';

import axios from 'axios';

import FormEvaluation from '../element/form.js'

export default function EmployeeForm(){
  return (
    <FormEvaluation level={1} />
  )
}