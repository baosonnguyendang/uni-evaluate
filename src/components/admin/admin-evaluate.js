import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { Link } from 'react-router-dom';

// import Modal from 'react-modal';  

import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import "bootstrap/dist/css/bootstrap.min.css";

function ListItem(props) {
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Correct! Key should be specified inside the array.
    <Link to=''><ListItem key={number.id} value={number.name} /></Link>
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [
  { id: 1, name: 'Đợt 1 năm 2020' },
  { id: 2, name: 'Đợt 2 năm 2020' },
];

//create modal

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function EvaluateList() {
  const classes = useStyles();

  // const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const modalStyle = {
    backgroundColor: 'white'
  }

  const body = (
    <div style={modalStyle}>
      <h2 id="simple-modal-title">Text in a modal</h2>
      <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p>
      <Button variant="contained" type="button" onClick={handleClose}>Lưu</Button>
    </div>
  );

  return (
    <Paper>
      <Typography component="h1" variant="h6" color="inherit" noWrap>
        Đợt đánh giá
        </Typography>
      <NumberList numbers={numbers} />
      <Button variant="contained" type="button" onClick={handleOpen}>Thêm đợt đánh giá</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </Paper>
  )
}