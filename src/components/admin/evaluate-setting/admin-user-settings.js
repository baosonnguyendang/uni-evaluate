import React, { useState } from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "mui-datatables";

export default function UserSettings(props) {
  const columns = ["Tên", "Mã NV", "Bộ môn"];

  // const data = [
  //   ["Joe James", "1712970", "Khoa học máy tính"],
  //   ["John Walsh", "1712972", "Hệ thống và Mạng"],
  //   ["Bob Herm", "1712973", "Hệ thống thông tin"],
  //   ["James Houston", "1712974", "Công nghệ phần mềm"],
  //   ["James Rodriguez", "1712975", "Kỹ thuật máy tính"],
  //   ["James Bond", "1712976", "Công nghệ phần mềm"],
  // ];

  const options = {
    filterType: 'checkbox',
    onRowsDelete: (rowsDeleted => {
      rowsDeleted.data.map(row => {
        console.log(row)
      })
    })
  };

  return (
    <MUIDataTable
      title={"Các thành viên tham gia đánh giá"}
      data={props.data}
      columns={columns}
      options={options}
    />
  );
}

