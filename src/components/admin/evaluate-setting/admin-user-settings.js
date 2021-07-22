import React, { useState, useEffect } from "react";

import axios from 'axios'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'

import { useDispatch } from "react-redux";
import MUIDataTable from "mui-datatables";

import Loading from '../../common/Loading'

export default function UserSettings(props) {

  const columns = ["Tên", "Mã NV", "Đơn vị"];
  // const data = [
  //   ["Joe James", "1712970", "Khoa học máy tính"],
  // ];
  //fe to be
  const dispatch = useDispatch()
  const [data, setData] = React.useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setData(props.data)
    // console.log(props.data)
    // console.log(props.loading)
  }, [props.data])

  const options = {
    filterType: 'checkbox',
    selectableRows: 'multiple',
    selectableRowsOnClick: true,
    onRowsDelete: (rowsDeleted) => {
      setLoading(true)
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
      axios.post(`/admin/form/${ fcode }/${ dcode }/removeFormUser`, body)
        .then(res => {
          props.setUnitMember(temp)
          setLoading(false)
          dispatch(showSuccessSnackbar('Xoá thành viên thành công'))

        }).catch(err => {
          console.log(err)
          setLoading(false)
          dispatch(showErrorSnackbar('Xoá thành viên thất bại'))
        })
    }
  };

  const onDelete = (x) => {
    // console.log(x)
    // console.log(props.data.indexOf(x))
    props.data.splice(props.data.indexOf(x), 1)
    // console.log(data.splice(data.indexOf(x), 1))
    setData(data => data.splice(data.indexOf(x), 1))
  }

  return (
    <div>
      <MUIDataTable
        title={"Các thành viên tham gia đánh giá"}
        data={data}
        columns={columns}
        options={options}
      />
      {props.loading && <Loading open />}
      {loading && <Loading open />}
    </div>
  );
}

