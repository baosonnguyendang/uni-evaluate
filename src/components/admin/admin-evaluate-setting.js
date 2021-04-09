import React from 'react';

import Paper from '@material-ui/core/Paper'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

export default function EvaluateSettings(props) {
  return (
    <Paper>
      <Table aria-label="caption table">
        <caption>Các nhóm tham gia đánh giá</caption>
        <TableHead>
          <TableRow>
            <TableCell align="left" />
            <TableCell align="left">Mã nhóm</TableCell>
            <TableCell align="left">Thành phần</TableCell>
          </TableRow>
        </TableHead>
      </Table>
    </Paper>
  )
}