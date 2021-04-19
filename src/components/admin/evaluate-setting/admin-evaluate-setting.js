import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import AddCriterion from './admin-add-criterion'

import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from '@material-ui/core/Typography';

export default function EvaluateSetting(props) {
  const name = props.name

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        Các nhóm tham gia đánh giá {name}
      </Typography>
      <Paper style={{ marginTop: '24px' }}>
        <Router>
          <Table aria-label="caption table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Mã nhóm</TableCell>
                <TableCell align="left">Thành phần</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow component={Link} href={window.location.href + '/a'}>
                <TableCell align="center">01</TableCell>
                <TableCell align="left">Giảng viên, Nghiên cứu viên, Kỹ sư phục vụ giảng dạy</TableCell>
              </TableRow>
              <TableRow component={Link} to='/'>
                <TableCell align="center">02</TableCell>
                <TableCell align="left">Nhân viên hành chính, kỹ thuật, phục vụ, bảo vệ</TableCell>
              </TableRow>
              <TableRow component={Link} to='/'>
                <TableCell align="center">03</TableCell>
                <TableCell align="left">Viên chức quản lý</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {/* <Switch>
            <Route path='/admin/evaluate-settings/a'>
              <AddCriterion />
            </Route>
          </Switch> */}
        </Router>
      </Paper>
    </div>
  )
}