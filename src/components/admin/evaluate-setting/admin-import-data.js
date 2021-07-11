import React, { useState, useEffect } from 'react'

import axios from 'axios'

import UpLoadFile from '../../common/UpLoadFile'
import { useDispatch } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Typography, TextField, Button, Modal, Fade, Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../actions/notifyAction'
import Loading from '../../common/Loading'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  dropdown: {
    marginBottom: 20,
  }
}));

export default function Import(props) {
  const classes = useStyles(); //css
  const dispatch = useDispatch()

  const [units, setUnits] = useState(null)
  const [standards, setStandards] = useState(null)
  const [criteria, setCriteria] = useState(null)

  const [unitChosen, setUnitChosen] = useState()
  const [standardChosen, setStandardChosen] = useState()
  const [criteriaChosen, setCriteriaChosen] = useState()
  const [loading, setLoading] = useState(false)
  const setChosen = (value, index) => {
    switch (index) {
      case 1:
        if (value == null) {
          setStandardChosen(null)
          setCriteriaChosen(null)
        }
        setUnitChosen(value)
        break;
      case 2:
        if (value == null) {
          setCriteriaChosen(null)
        }
        setStandardChosen(value)
        break;
      case 3:
        setCriteriaChosen(value)
        break;
      default:
        return null
    }
  }

  useEffect(() => {
    axios.get(`/admin/form/${props.fcode}/getFormDepartments`)
      .then(res => {
        console.log(res.data)
        let t = []
        res.data.formDepartments.map(unit => {
          t.push({ code: unit.department_id.department_code, name: unit.department_id.name })
        })
        t = t.filter(x => x.code != 'HDDG')
        setUnits([...t])
      })
      .catch(err => {
        console.log(err)
      })
    axios.get(`/admin/form/${props.fcode}/getFormStandard`)
      .then(res => {
        console.log(res.data)
        let temp = []
        res.data.formStandards.map(x => {
          temp.push({ code: x.standard_id.code, name: x.standard_id.name })
        })
        setStandards([...temp])
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    console.log(standardChosen)
    if (standardChosen) {
      axios.get(`/admin/form/${props.fcode}/standard/${standardChosen.code}/getFormCriteria`)
        .then(res => {
          console.log(res.data)
          let t = []
          res.data.formCriteria.map(x => {
            t.push({ code: x.criteria_id.code, name: x.criteria_id.name })
          })
          setCriteria([...t])
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [standardChosen])

  const exportTemplate = () => {
    const fcode = props.fcode;
    setLoading(true)
    const body = {
      dcode: unitChosen.code,
      scode: standardChosen.code,
      ccode: criteriaChosen.code
    }
    axios({
      url: `/admin/file/form/${fcode}/evaluation/export`,
      method: 'POST',
      data: body,
      responseType: 'blob', // important
    })
      .then(async res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${body.dcode}-${body.ccode}.xlsx`); //or any other extension
        document.body.appendChild(link);
        setLoading(false)
        link.click();
      })
      .catch(error => {
        setLoading(false)

        if (error.response) {
          if (error.response.status === 405) {
            // Trả lỗi
            // Message: "Tiêu chí chưa được hỗ trợ để xuất file"
            dispatch(showErrorSnackbar('Tiêu chí chưa được hỗ trợ để xuất file'))
          }
          if (error.response.status === 404) {
            // Trả lỗi
            // Message: "Không tìm thấy tài nguyên yêu cầu"
            dispatch(showErrorSnackbar('Không tìm thấy tài nguyên yêu cầu'))
          }
          if (error.response.status === 500) {
            // Trả lỗi
            // Message: "Phát sinh lỗi hệ thống. Xin thử lại lần sau."
            dispatch(showErrorSnackbar('Phát sinh lỗi hệ thống. Xin thử lại lần sau'))
          }
        }
      })
  }

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitExcel = (data) => {
    const fcode = props.fcode;
    setLoading(true)
    handleClose()
    const body = {
      dcode: unitChosen.code,
      scode: standardChosen.code,
      ccode: criteriaChosen.code
    }
    const formData = new FormData()
    formData.append("file", data)
    formData.append("dcode", body.dcode)
    formData.append("scode", body.scode)
    formData.append("ccode", body.ccode)
    axios.post(`/admin/file/form/${fcode}/evaluation/import`, formData)
      .then(res => {
        console.log(res.data);
        setLoading(false)
        dispatch(showSuccessSnackbar('Thêm điểm cho tiêu chí thành công'))
      })
      .catch(error => {
        setLoading(false)
        if (error.response) {
          if (error.response.status === 400) {
            // Trả lỗi
            // Message: "Tiêu chí trong excel không phù hợp"
            dispatch(showErrorSnackbar('Tiêu chí trong excel không phù hợp'))
          }
          if (error.response.status === 404) {
            // Trả lỗi
            // Message: "Không tìm thấy tài nguyên yêu cầu"
            dispatch(showErrorSnackbar('Không tìm thấy tài nguyên yêu cầu'))
          }
          if (error.response.status === 500) {
            // Trả lỗi
            // Message: "Phát sinh lỗi hệ thống. Xin thử lại lần sau."
            dispatch(showErrorSnackbar('Phát sinh lỗi hệ thống. Xin thử lại lần sau'))
          }
        }
      })
  }

  return (
    <div>
      <Loading open={loading} />
      <Typography style={{ marginBottom: 18 }} component="h3" variant="h5" color="inherit">
        Thêm dữ liệu có sẵn
      </Typography>
      <Autocomplete
        className={classes.dropdown}
        loadingText="Đang tải..."
        noOptionsText='Không tồn tại'
        loading={!units}
        options={units || []}
        onChange={(event, value) => setChosen(value, 1)}
        getOptionLabel={(option) => option.name + ' (' + option.code + ')'}
        style={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Chọn Đơn vị" variant="outlined" />}
      />
      {unitChosen &&
        <Autocomplete
          margin='normal'
          className={classes.dropdown}
          options={standards || []}
          loadingText="Đang tải..."
          noOptionsText='Không tồn tại'
          loading={!standards}
          onChange={(event, value) => setChosen(value, 2)}
          getOptionLabel={(option) => option.name + ' (' + option.code + ')'}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Chọn Tiêu chuẩn" variant="outlined" />}
        />
      }
      {standardChosen &&
        <Autocomplete
          className={classes.dropdown}
          margin='normal'
          options={criteria || []}
          loadingText="Đang tải..."
          noOptionsText='Không tồn tại'
          loading={!criteria}
          onChange={(event, value) => setChosen(value, 3)}
          getOptionLabel={(option) => option.name + ' (' + option.code + ')'}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Chọn Tiêu chí" variant="outlined" />}
        />
      }
      {criteriaChosen &&
        <div style={{ marginTop: 35 }}>
          <Button variant="contained" color="primary" onClick={exportTemplate}>
            Xuất
          </Button>
          <Button style={{ marginLeft: 10 }} variant="contained" color="secondary" onClick={handleOpen}>
            Nhập
          </Button>
          <Modal
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div className={classes.paper}>
                <UpLoadFile title={'Thêm dữ liệu cho tiêu chí'} handleClose={handleClose} submit={submitExcel} />
              </div>
            </Fade>
          </Modal>
        </div>

      }
    </div>
  )
}