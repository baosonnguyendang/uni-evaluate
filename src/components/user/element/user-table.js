import React from 'react'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, makeStyles, Paper, Grid, Radio } from "@material-ui/core";

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

    return (
        <Grid container xs={12} justify='center'>
            <TableContainer component={Paper}>
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
                    <TableRow>
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
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Hoàn thành từ 90% đến dưới 110% định mức giờ chuẩn trên lớp</TableCell>
                        <TableCell>22.0</TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Hoàn thành từ 70% đến dưới 90% định mức giờ chuẩn trên lớp</TableCell>
                        <TableCell>18.0</TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Hoàn thành từ 50% đến dưới 70% định mức giờ chuẩn trên lớp</TableCell>
                        <TableCell>16.0</TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Hoàn thành từ 30% đến dưới 50% định mức giờ chuẩn trên lớp</TableCell>
                        <TableCell>14.0</TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                        <TableCell align='center' colSpan={1}><Radio/></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>1.2</TableCell>
                        <TableCell>Hoàn thành từ 30% đến dưới 50% định mức giờ chuẩn trên lớp</TableCell>
                    </TableRow>
                </TableBody>
                </Table>
            </TableContainer>
        </Grid>
        
    )
}

export default TableEvaluation
