import React, { useState, useEffect } from 'react'
import { TableContainer, Table, 
  TableHead, TableRow, TableCell, 
  TableBody, makeStyles, Paper, Grid, 
  Radio, Button, Checkbox,
  LinearProgress
} from "@material-ui/core";

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
  const [loading, setLoading] = useState(false)
  // const [data, setData] = useState({})
  const token = localStorage.getItem('token')
  const { id1 } = useParams()

  const [data, setData] = useState([])

  console.log(id1)

  useEffect(() => {
    setLoading(true)
    axios.get(`/form/v2/${id1}`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data.formStandards)
        setData(res.data.formStandards)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])
  return (
    < >
      { loading ? <LinearProgress style={{position:"absolute", width:"100%" }} /> : (
        <Grid container xs={12} justify='center' style={{ marginTop: '45px' }}>
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
                      <TableCell align='center'>{criteria.options.length > 0 ? null : <Checkbox name={criteria.criteria_id.code} value={criteria.point}/>}</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    {criteria.options.map((option, index) => (
                      <TableRow>
                        <TableCell>{option.name}</TableCell>
                        <TableCell>{option.max_point}</TableCell>
                        <TableCell align='center' colSpan={1}><input type="radio" name={criteria.criteria_id.code} value={option.max_point}/></TableCell>
                        <TableCell align='center' colSpan={1}></TableCell>
                        <TableCell align='center' colSpan={1}></TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary">
        Hoàn thành đánh giá
      </Button>
        </Grid>
      )}
      
    </>

  )
}

export default TableEvaluation
