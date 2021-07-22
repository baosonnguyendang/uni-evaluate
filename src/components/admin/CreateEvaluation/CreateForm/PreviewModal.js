import React, { useState, useEffect } from 'react'

import axios from 'axios'

import { Modal, Backdrop, Fade, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Grid, } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';
import Loading from '../../../common/Loading'


const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  paper1: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: '80%',
    maxHeight: '90vh',
    overflowY: 'overlay'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default function Preview(props) {
  const classes = useStyles();

  const [form, setForm] = useState([])

  const [done, setDone] = useState(false)

  useEffect(() => {
    // console.log(props.standards)
    axios.get(`/admin/form/${ props.id }/getReviewForm`)
      .then(res => {
        // console.log(res.data)
        setForm(res.data.formStandards)
        setDone(true)
      })
      .catch(err => {
        // console.log(err)
      })
    // props.standards.map(standard => {
    //   axios.get(`/admin/form/${props.id}/standard/${standard.code}/getFormCriteria`)
    //     .then(res => {
    //       // console.log(res.data)
    //       standard.criteria = res.data.formCriteria
    //     })
    //     .catch(err => (
    //       // console.log(err)
    //     ))
    // })
    // // console.log(props.standards)
    // setForm([...props.standards])
    // setDone(true)
  }, [])
  if (!done) return <Loading open />
  return (
    <Modal
      className={classes.modal}
      open={props.open}
      onClose={props.handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <div className={classes.paper1}>
          <Grid container xs={12} justify='center' style={{ marginTop: '30px' }}>
            <TableContainer component={Paper} >
              <Table className={classes.table} >
                <TableHead>
                  <TableRow>
                    <TableCell rowSpan={2}>Tiêu chuẩn/ Tiêu chí</TableCell>
                    <TableCell rowSpan={2} align="center">Nội dung</TableCell>
                    <TableCell rowSpan={2} align="center">Điểm quy định</TableCell>
                    <TableCell colSpan={3} align="center">Điểm đánh giá</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">Cá nhân tự chấm</TableCell>
                    <TableCell align="center">Trưởng Đơn vị</TableCell>
                    <TableCell align="center">Hội đồng nhà trường</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {done && form.map(standard => {
                    return (
                      (
                        <>
                          <TableRow>
                            <TableCell align='center'>{standard.standard_order}</TableCell>
                            <TableCell><b>{standard.standard_id.name}</b></TableCell>
                            <TableCell align='center'>{standard.standard_point}</TableCell>
                            <TableCell />
                            <TableCell />
                            <TableCell />
                          </TableRow>
                          {standard.formCriteria && standard.formCriteria.map((criteria, index) => (
                            <>
                              <TableRow>
                                <TableCell align='center' rowSpan={criteria.options.length + 1} >{standard.standard_order}.{criteria.criteria_order}</TableCell>
                                <TableCell><b>{criteria.criteria_id.name}</b></TableCell>
                                <TableCell align='center'>{criteria.point}</TableCell>
                                <TableCell align='center'></TableCell>
                                <TableCell align='center'></TableCell>
                                <TableCell align='center'></TableCell>
                              </TableRow>
                              {criteria.options.map((option, index) => (
                                <TableRow>
                                  <TableCell>{option.name}</TableCell>
                                  <TableCell align='center'>{option.max_point}</TableCell>
                                  <TableCell align='center' colSpan={1}></TableCell>
                                  <TableCell align='center' colSpan={1}></TableCell>
                                  <TableCell align='center' colSpan={1}></TableCell>
                                </TableRow>
                              ))}
                            </>
                          ))}
                        </>
                      )
                    )
                  })}
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell><b>Tổng điểm</b></TableCell>
                    <TableCell></TableCell>
                    <TableCell align='center'></TableCell>
                    <TableCell align='center'></TableCell>
                    <TableCell align='center'></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </div>
      </Fade>
    </Modal>
  );
}