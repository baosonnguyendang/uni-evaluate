import React, { useState, useEffect } from 'react';

import EvaluateSetting from './evaluate-setting/admin-evaluate-setting'

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import DatePicker from 'react-datepicker';

import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

function ListItem(props) {
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((item) =>
    // Correct! Key should be specified inside the array.
    <Link to={'/admin/evaluate-settings/' + item.id}><ListItem key={item.id} value={item.name} /></Link>
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

//create modal

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '10px',
    marginTop: '15px'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper1: {
    position: 'absolute',
    // padding: '10px',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function EvaluateList() {
  const classes = useStyles();

  //open modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //date picker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  //new Evaluation
  const listEvaluate = [
    { id: 1, name: 'Đợt 1 năm 2020' },
    { id: 2, name: 'Đợt 2 năm 2020' },
  ];
  const [number, setNumber] = useState(listEvaluate);

  const [evaluation, setEvaluation] = useState('')
  const submit = e => {
    e.preventDefault()
    setNumber(number => [...number, { id: listEvaluate.length, name: evaluation }])
    // // useEffect
    // console.log(number)
    // console.log(listEvaluate)
  }

  return (
    <div>
      <Typography component="h1" variant="h5" color="inherit" noWrap>
        DANH SÁCH ĐỢT ĐÁNH GIÁ
      </Typography>
      <Paper className={classes.paper}>
        <NumberList numbers={number} />
        <Button variant="contained" type="button" onClick={handleOpen}>Thêm đợt đánh giá</Button>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
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
            <div className={classes.paper1}>
              <h2 id="transition-modal-title">Thêm đợt đánh giá</h2>
              <form onSubmit={submit}>
                <TextField
                  // onChange={this.onChangeUsername}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="evaluateName"
                  label="Tên đợt đánh giá"
                  name="evaluateName"
                  autoComplete="evaluateName"
                  autoFocus
                  onChange={e => setEvaluation(e.target.value)}
                />
                <label>Từ ngày:  &nbsp; </label>
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} selectsStart
                  startDate={startDate} endDate={endDate} dateFormat="dd/MM/yyyy"
                />
                <br />
                <label>Đến ngày:&nbsp; </label>
                <DatePicker selected={endDate} onChange={date => setEndDate(date)} selectsEnd
                  startDate={startDate} endDate={endDate} minDate={startDate} dateFormat="dd/MM/yyyy"
                />
                <br />
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary">Tạo</Button>
                  <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={handleClose}>Hủy</Button>
                </div>
              </form>
            </div>
          </Fade>
        </Modal>
      </Paper>
    </div>
  )
}