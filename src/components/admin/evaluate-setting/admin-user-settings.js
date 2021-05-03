import React, { useState } from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "mui-datatables";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default function UserSettings() {
  const columns = ["Tên", "Mã NV", "City"];

  const data = [
    ["Joe James", "1712970", "Yonkers"],
    ["John Walsh", "1712972", "Hartford"],
    ["Bob Herm", "1712973", "Tampa"],
    ["James Houston", "1712974", "Dallas"],
  ];

  const options = {
    filterType: 'checkbox',
  };

  return (
    <MUIDataTable
      title={"Các thành viên tham gia đánh giá"}
      data={data}
      columns={columns}
      options={options}
    />
  );
}

