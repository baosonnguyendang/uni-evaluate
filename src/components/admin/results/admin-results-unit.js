import React, { useState, useEffect } from 'react';

import axios from 'axios'

import { Link, useParams, useRouteMatch } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  number: {
    textAlign: 'center'
  },
  paper: {
    minHeight: 400,
    marginTop: 24,
    position: 'relative',
  },
}))

// var { url } = useRouteMatch();

function createData(name, id, unit, status, _id) {
  return { name, id, unit, status, link: 'Kết quả', _id, already: false }
}

const CustomTableCell = ({ row, name }) => {
  var { url } = useRouteMatch();
  if (name === 'id') {
    return (
      <TableCell style={{ textAlign: 'center' }}>{row[name]}</TableCell>
    )
  }
  else {
    return (
      <TableCell>
        {name === 'link' ? (row.already == true ? (<Link to={`${url}/` + row._id} >{row[name]}</Link>) : null) : (row[name])}
      </TableCell>
    )
  }
};

export default function Results(props) {
  const classes = useStyles()
  const { id, id1, id2 } = useParams()

  var code

  const [rows, setRows] = useState([]);

  //lấy mã form and then ds gv/vc thuộc đơn vị
  useEffect(() => {
    axios.get(`/admin/review/${id}/formtype/${id1}/form/`)
      .then(res => {
        if (res.data.form) {
          // setCode(res.data.form.code)
          code = res.data.form.code

          axios.get(`/admin/form/${code}/${id2}/getFormUser`)
            .then(res => {
              let temp = []
              console.log(res.data.formUser)
              res.data.formUser.map(x => {
                temp.push(createData(x.user_id.lastname + ' ' + x.user_id.firstname, x.user_id.staff_id, x.user_id.department.length > 0 ? x.user_id.department[0].name : null, 'Chưa đánh giá', null))
              })
              axios.get(`/admin/form/${code}/${id2}/formuser/get`)
                .then(res => {
                  console.log(res.data.formUsers)
                  res.data.formUsers.map(user => {
                    let pts = [' --', ' --', ' --']
                    if (user.evaluateForm) {
                      temp.find(x => x.id == user.user_id.staff_id).already = true
                      user.evaluateForm.map(x => {
                        pts[user.evaluateForm.indexOf(x)] = x.point ? x.point : ' --'
                      })
                    }
                    temp.find(x => x.id == user.user_id.staff_id).status = pts.toString()
                    temp.find(x => x.id == user.user_id.staff_id)._id = user.userForm ? user.userForm._id : null
                  })
                  setRows(temp)
                })
                .catch(err => {
                  console.log(err)
                })
            })
            .catch(err => console.log(err))
        }
      })
      .catch(e => {
        console.log(e)
      })

  }, [])

  //qua trang
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        Kết quả đánh giá nhóm {id1}
      </Typography>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table" id='table'>
            <TableHead>
              <TableRow style={{ backgroundColor: '#f4f4f4' }}>
                <TableCell align="center">Mã viên chức</TableCell>
                <TableCell>Tên viên chức</TableCell>
                <TableCell>Đơn vị</TableCell>
                <TableCell>Điểm thành phần</TableCell>
                <TableCell ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow key={row.id}>
                    <CustomTableCell {...{ row, name: "id" }} />
                    <CustomTableCell {...{ row, name: "name" }} />
                    <CustomTableCell {...{ row, name: "unit" }} />
                    <CustomTableCell {...{ row, name: "status" }} />
                    <CustomTableCell {...{ row, name: "link" }} />
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  )
}