import React, { useState } from "react";

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
  //   ["John Walsh", "1712972", "Hệ thống và Mạng"],
  //   ["Bob Herm", "1712973", "Hệ thống thông tin"],
  //   ["James Houston", "1712974", "Công nghệ phần mềm"],
  //   ["James Rodriguez", "1712975", "Kỹ thuật máy tính"],
  //   ["James Bond", "1712976", "Công nghệ phần mềm"],
  // ];

  const [data, setData] = React.useState(props.data)

  const options = {
    filterType: 'checkbox',
    selectableRows: true,
    selectableRowsOnClick: true,
    onRowsDelete: (rowsDeleted) => {
      const idsToDelete = rowsDeleted.data.map(item => item.dataIndex) // đây là mảng lưu index bị xóa
      console.log(data)
      let temp = data.slice()
      console.log(temp)
      let tempp = temp.splice(0, 1)
      console.log(tempp)
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
          data={props.data}
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

