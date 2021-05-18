import React, { useState, useEffect } from 'react'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, makeStyles, Paper, Grid, Radio, Button } from "@material-ui/core";

import axios from 'axios'

import { useParams } from 'react-router-dom'

const TAX_RATE = 0.07;

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow('1', 100, 1.15),
  createRow('2', 10, 45.99),
  createRow('3', 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

const TableEvaluation = () => {
  const classes = useStyles();

  // const [data, setData] = useState({})
  const token = localStorage.getItem('token')
  const { id1 } = useParams()

  const [data, setData] = useState([])

  console.log(id1)

  useEffect(() => {
    axios.get(`/form/v2/${id1}`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data.formStandards)
        setData(res.data.formStandards)
      })
      .catch(err => console.log(err))
  }, [])


  // const data = {
  //   "formStandards": [
  //     {
  //       "_id": "609a47507662413b101d8c17",
  //       "standard_id": {
  //         "_id": "60884e27f4c3ff4348f13fee",
  //         "code": "TC001",
  //         "name": "Hoạt động giảng dạy",
  //         "description": "Mô tả"
  //       },
  //       "standard_order": 1,
  //       "standard_point": 42,
  //       "formCriteria": [
  //         {
  //           "_id": "609d4a09a453d62bbc953b20",
  //           "criteria_id": {
  //             "_id": "608850ec4ecadc1a9c23e571",
  //             "code": "TC001-01",
  //             "name": "Định mức giờ chuẩn hoàn thành",
  //             "description": "Đánh giá số giờ giảng dạy của giáo viên"
  //           },
  //           "criteria_order": "1",
  //           "point": 26,
  //           "options": [
  //             {
  //               "_id": "609aca72928df90004f783ce",
  //               "name": "Hoàn thành từ 110% định mức giờ chuẩn trực tiếp trên lớp trở lên",
  //               "max_point": 26,
  //               "description": ""
  //             },
  //             {
  //               "_id": "609acb1a928df90004f783cf",
  //               "name": "Hoàn thành từ 90% đến dưới 110% định mức giờ chuẩn trực tiếp trên lớp",
  //               "max_point": 22,
  //               "description": ""
  //             },
  //             {
  //               "_id": "609acb5a928df90004f783d0",
  //               "name": "Hoàn thành từ 70% đến dưới 90% định mức giờ chuẩn trực tiếp trên lớp",
  //               "max_point": 18,
  //               "description": ""
  //             },
  //             {
  //               "_id": "609acbc0928df90004f783d1",
  //               "name": "Hoàn thành từ 50% đến dưới 70% định mức giờ chuẩn trực tiếp trên lớp",
  //               "max_point": 16,
  //               "description": ""
  //             },
  //             {
  //               "_id": "609acbcb928df90004f783d2",
  //               "name": "Hoàn thành từ 30% đến dưới 50% định mức giờ chuẩn trực tiếp trên lớ",
  //               "max_point": 14,
  //               "description": ""
  //             }
  //           ]
  //         },
  //         {
  //           "_id": "609d4a0aa453d62bbc953b21",
  //           "criteria_id": {
  //             "_id": "608851144ecadc1a9c23e572",
  //             "code": "TC001-02",
  //             "name": "Kết quả khảo sát chất lượng dịch vụ",
  //             "description": ""
  //           },
  //           "criteria_order": "2",
  //           "point": 10,
  //           "options": []
  //         },
  //         {
  //           "_id": "609d5f241344500004093610",
  //           "criteria_id": {
  //             "_id": "60885ec594ccdb39b42d4207",
  //             "code": "TC001-03",
  //             "name": "Hình thức giảng dạy khác",
  //             "description": ""
  //           },
  //           "criteria_order": "3",
  //           "point": 6,
  //           "options": []
  //         }
  //       ]
  //     },
  //     {
  //       "_id": "609a491e608fed36480eae30",
  //       "standard_id": {
  //         "_id": "60884e4df4c3ff4348f13fef",
  //         "code": "TC002",
  //         "name": "Hoạt động khoa học",
  //         "description": "Mô tả"
  //       },
  //       "standard_order": 2,
  //       "standard_point": 32,
  //       "formCriteria": []
  //     },
  //     {
  //       "_id": "609a4e697c8f322db4806290",
  //       "standard_id": {
  //         "_id": "60917238889a990004d26583",
  //         "code": "TC004",
  //         "name": "Hoạt động chuyên môn khác",
  //         "description": ""
  //       },
  //       "standard_order": 5,
  //       "standard_point": 10,
  //       "formCriteria": []
  //     },
  //     {
  //       "_id": "609c010ceca9d0000432cd88",
  //       "standard_id": {
  //         "_id": "60917288889a990004d26584",
  //         "code": "TC005",
  //         "name": "Kiến thức, kỹ năng bổ trợ",
  //         "description": ""
  //       },
  //       "standard_order": 4,
  //       "standard_point": 6,
  //       "formCriteria": []
  //     },
  //     {
  //       "_id": "609c010ceca9d0000432cd89",
  //       "standard_id": {
  //         "_id": "6091715a889a990004d26581",
  //         "code": "TC003",
  //         "name": "Hoạt động xã hội",
  //         "description": "Hoạt động xã hội, cộng đồng"
  //       },
  //       "standard_order": 3,
  //       "standard_point": 10,
  //       "formCriteria": []
  //     },
  //     {
  //       "_id": "609d44b4d4de5700048bc2a0",
  //       "standard_id": {
  //         "_id": "609172b0889a990004d26585",
  //         "code": "TC006",
  //         "name": "Điểm cộng",
  //         "description": ""
  //       },
  //       "standard_order": 6,
  //       "standard_point": 5,
  //       "formCriteria": []
  //     }
  //   ]
  //}
  return (
    <Grid container xs={12} justify='center' style={{ paddingTop: '45px' }}>
      <TableContainer component={Paper} style={{ marginBottom: '30px' }}>
        <Table className={classes.table} >
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2}>Tiêu chuẩn/ Tiêu chí</TableCell>
              <TableCell rowSpan={2}>Nội dung</TableCell>
              <TableCell rowSpan={2}>Điểm quy định</TableCell>
              <TableCell colSpan={3} align="center">Điểm đánh giá</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">Cá nhân tự chấm</TableCell>
              <TableCell align="center">Trưởng bộ môn</TableCell>
              <TableCell align="center">Hội đồng nhà trường</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(standard => (
              <>
                <TableRow>
                  <TableCell>{standard.standard_order}</TableCell>
                  <TableCell><b>{standard.standard_id.name}</b></TableCell>
                  <TableCell>{standard.standard_point}</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>

                {standard.formCriteria.map((criteria, index) => (
                  <>
                    <TableRow>
                      <TableCell rowSpan={criteria.options.length + 1} >{standard.standard_order}.{criteria.criteria_order}</TableCell>
                      <TableCell><b>{criteria.criteria_id.name}</b></TableCell>
                      <TableCell>{criteria.point}</TableCell>
                      <TableCell align='center'>{criteria.options.length > 0 ? null : <Radio/>}</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    {criteria.options.map((option, index) => (
                      <TableRow>
                        <TableCell>{option.name}</TableCell>
                        <TableCell>{option.max_point}</TableCell>
                        <TableCell align='center' colSpan={1}></TableCell>
                        <TableCell align='center' colSpan={1}></TableCell>
                        <TableCell align='center' colSpan={1}></TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
              </>
            ))}
            {/* <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Hoạt động giảng dạy</TableCell>
              <TableCell>42.0</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell rowSpan={5}>1.1</TableCell>
              <TableCell>Hoàn thành từ 110% định mức giờ chuẩn trên lớp</TableCell>
              <TableCell>26.0</TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hoàn thành từ 90% đến dưới 110% định mức giờ chuẩn trên lớp</TableCell>
              <TableCell>22.0</TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hoàn thành từ 70% đến dưới 90% định mức giờ chuẩn trên lớp</TableCell>
              <TableCell>18.0</TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hoàn thành từ 50% đến dưới 70% định mức giờ chuẩn trên lớp</TableCell>
              <TableCell>16.0</TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hoàn thành từ 30% đến dưới 50% định mức giờ chuẩn trên lớp</TableCell>
              <TableCell>14.0</TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
              <TableCell align='center' colSpan={1}><Radio /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>1.2</TableCell>
              <TableCell>Hoàn thành từ 30% đến dưới 50% định mức giờ chuẩn trên lớp</TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary">
        Hoàn thành đánh giá
      </Button>
    </Grid>

  )
}

export default TableEvaluation
