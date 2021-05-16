import React, { useState, useEffect } from "react";

import axios from 'axios'

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from "@material-ui/core/IconButton";
import MUIDataTable from "mui-datatables";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650
  },
  name: {
    width: '30%',
    height: 40,
  },
  number: {
    width: '10%'
  },
}));

export default function UserSettings(props) {
  const classes = useStyles();

  const columns = ["Tên", "Mã NV", "Bộ môn"];
  const type = props.type
  // const data = [
  //   ["Joe James", "1712970", "Khoa học máy tính"],
  // ];
  console.log(props.unit, props.type, props.fcode)
  //fe to be
  const token = localStorage.getItem('token')

  const [data, setData] = React.useState([])

  const [fetched, setFetched] = React.useState(false)

  useEffect(() => {
    if (fetched == false) {
      setFetched(true)
      axios.get(`/admin/form/${props.fcode}/${props.unit}/getFormUser`, { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => {
          let temp = []
          res.data.formUser.map(x => {
            let name = x.user_id.department.length > 0 ? x.user_id.department[0].name : ''
            temp.push([x.user_id.lastname + ' ' + x.user_id.firstname, x.user_id.staff_id, name])
          })
          console.log(temp)
          setData(temp)
        })
        .catch(err => console.log(err))
    }
  }, [])

  const options = {
    filterType: 'checkbox',
    selectableRows: true,
    selectableRowsOnClick: true,
    onRowsDelete: (rowsDeleted) => {
      const idsToDelete = rowsDeleted.data.map(item => item.dataIndex)
      let temp = data.slice()
      let bin = []
      idsToDelete.map(x => {
        bin.push(temp[x][1])
        temp[x] = null
      })
      temp = temp.filter(x => x != null)
      const fcode = props.fcode;
      const dcode = props.unit;
      const body = {
        delete_users: bin
      }
      axios.post(`/admin/form/${fcode}/${dcode}/removeFormUser`, body, { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => {
          setData(temp)
        })
        .catch(err => console.log(err))
    }
  };

  const onDelete = (x) => {
    console.log(x)
    console.log(props.data.indexOf(x))
    props.data.splice(props.data.indexOf(x), 1)
    console.log(data.splice(data.indexOf(x), 1))
    setData(data => data.splice(data.indexOf(x), 1))
  }

  return (
    <div>
      {type !== '03' ? (
        <MUIDataTable
          title={"Các thành viên tham gia đánh giá"}
          data={data}
          columns={columns}
          options={options}
        />
      ) : (
        <Table className={classes.table} aria-label="caption table">
          <TableHead>
            {console.log(props.data)}
            <TableRow style={{ backgroundColor: '#f4f4f4' }}>
              <TableCell className={classes.number} >Mã GV/VC</TableCell>
              <TableCell className={classes.name} >Tên GV/VC</TableCell>
              <TableCell >Bộ môn</TableCell>
              <TableCell align="left" />
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map(x => {
              return (
                <TableRow>
                  <TableCell >{x[1]}</TableCell>
                  <TableCell >{x[0]}</TableCell>
                  <TableCell >{x[2]}</TableCell>
                  <TableCell align="left" >
                    <IconButton
                      aria-label="delete"
                      onClick={() => onDelete(x)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

