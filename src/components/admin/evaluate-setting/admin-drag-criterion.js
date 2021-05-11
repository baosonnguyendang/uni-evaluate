import React, { useState, useEffect } from 'react';

import axios from 'axios';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper1: {
    position: 'absolute',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minHeight: 250,
  },
}))

export default function Drag() {
  const classes = useStyles()

  //phai an luu form 1 lan moi co the vao them tieu chi dc
  const [bool, setBool] = React.useState(false)

  //cái này là để mở cái modal chỉnh tiêu chí
  const [openCriteria, setOpenCriteria] = React.useState(false);
  const handleCloseCriteria = () => {
    console.log(itemsCriteria)
    setOpenCriteria(false);
  }

  const PostButton = (props) => {
    let style = {
      margin: 10,
      height: 30,
    };

    return (
      <Button variant="contained" style={style} onClick={() => props.handleClick()}>{props.label}</Button>
    );
  }

  const PostText = (props) => {
    return (
      <Typography style={props.score ? { marginTop: 10, lineHeight: '30px' } : { textAlign: 'center' }}>{props.text}</Typography>
    );
  }

  //id tieu chuan duoc chon
  const [chosen, setChosen] = useState()

  const Post = (props) => {
    let style = {
      display: "flex",
    };

    const handleOpen = (x) => {
      setChosen(x)
      setOpenCriteria(true)
    }

    const setPoint = (e) => {
      openCriteria ? (itemsCriteria.find(x => x.code === props.code).pts = e) : (items.find(x => x.code === props.code).pts = e)
    }

    return (
      <tr>
        <td><PostButton label='x' handleClick={props.removeItem} /></td>
        <td><span type={!openCriteria && 'button'} onClick={() => { bool && !openCriteria && handleOpen(props.code) }}><PostText text={props.title} /></span></td>
        <td style={style}>
          <PostButton label='+' handleClick={props.incrementScore} />
          <PostText score={true} text={props.score} style={{ lineHeight: 30 }} />
          <PostButton label='-' handleClick={props.decrementScore} />
        </td>
        <td>
          <TextField 
            defaultValue={
              openCriteria ? (
                itemsCriteria.filter(x => x.code == props.code).length > 0 ? (itemsCriteria.find(x => x.code === props.code).pts) : (5)
              ) : (
                items.filter(x => x.code == props.code).length > 0 ? items.find(x => x.code === props.code).pts : 5
              )} 
            onChange={e => setPoint(e.target.value)} 
            id="outlined-basic" type='number' label="Điểm tối đa" variant="outlined" size='small' />
        </td>
      </tr>
    );
  }

  const PostList = (props) => {
    return (
      <table style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th></th>
            <th style={{ textAlign: 'center' }}>Tên tiêu chuẩn</th>
            <th style={{ textAlign: 'center' }}>STT</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            props.postList.map((item, index) => (
              <Post key={index}
                title={item.title}
                score={item.score}
                code={item.code}
                incrementScore={() => props.updateScore(index, 1)}
                decrementScore={() => props.updateScore(index, -1)}
                removeItem={() => props.removeItem(index)}
                point={() => props.point(index)}
              />
            ))
          }
        </tbody>
      </table >
    )
  }

  //lấy nhẹ data tiêu chuẩn từ db
  const [data, setData] = React.useState([])

  const token = localStorage.getItem('token')
  const fetchCriterion = () => {
    axios.get('admin/standard/criteria', { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setData(res.data.standards)
      })
      .catch(e => {
        console.log(e)
      })
  }

  useEffect(() => {
    if (data.length === 0) {
      fetchCriterion()
    }
  })

  //cai tren la ds tieu chuan, cai duoi la ds tieu chi
  const [items, setItems] = useState([])
  const [itemsCriteria, setItemsCriteria] = useState([])

  //chon tieu chuan
  const [newCriterion, setNewCriterion] = React.useState('');
  const handleChangeCriterion = (event) => {
    setNewCriterion(event.target.value);
  };

  //chon tieu chi
  const [newCriteria, setNewCriteria] = React.useState('');
  const handleChangeCriteria = (event) => {
    setNewCriteria(event.target.value);
  };

  //thung rac, tieu chuan nao them vo roi thi bo vo day, khong hien thi trong selection nua
  const [bin, setBin] = React.useState([])

  const addItem = (type) => {
    let itemsCopy = type === 'criterion' ? items.slice() : itemsCriteria.slice()
    let truncatedString = (type === 'criterion' ? data.find(x => x.code == newCriterion).name : (chosen && data.find(x => x.code == chosen).criteria.find(y => y.code == newCriteria).name)); //data.find(x => x.code == value).name
    itemsCopy.push({ "title": truncatedString, "score": itemsCopy.length + 1, "code": type === 'criterion' ? newCriterion : newCriteria, "pts": 5 })
    itemsCopy.sort((a, b) => {
      return a.score - b.score;
    })
    if (type === 'criterion') {
      setItems(itemsCopy)
      let temp = data.find(x => x.code == newCriterion)
      // setBin(x => x.concat([temp]))
      setBin(x => [...x, temp])
      // bin.push(data.find(x => x.code == newCriterion))
      data.splice(data.indexOf(data.find(x => x.code == newCriterion)),1)
      setNewCriterion('')
    } else {
      setItemsCriteria(itemsCopy)
      setNewCriteria('')
    }
  }

  const updateScore = (index, val) => {
    let itemsCopy = openCriteria ? itemsCriteria.slice() : items.slice();
    if ((itemsCopy[index].score <= items.length && val > 0) || (itemsCopy[index].score > 1 && val < 0)) {
      itemsCopy[index].score += val
    }
    itemsCopy.sort((a, b) => {
      return a.score - b.score;
    })
    openCriteria ? setItemsCriteria(itemsCopy) : setItems(itemsCopy)
    console.log(data)
    // this.setState({ items: itemsCopy });
  }

  const removeItem = (index) => {
    var itemsCopy = openCriteria ? itemsCriteria.slice() : items.slice();
    itemsCopy.splice(index, 1);
    itemsCopy.sort((a, b) => {
      return a.score - b.score;
    });
    if (openCriteria){
      setItemsCriteria(itemsCopy)
    } else {
      setItems(itemsCopy)
      console.log(bin)
      console.log(itemsCopy)
      // itemsCopy.map(x => x.code)
    }
    // openCriteria ? setItemsCriteria(itemsCopy) : setItems(itemsCopy)
    // this.setState({ items: itemsCopy });
  }

  //luu nhe cai form
  const save = () => {
    new Set(items.map(x => x.score)).size !== items.map(x => x.score).length && alert('Xem lại STT')
    setBool(true)
  }

  return (
    <div>
      <FormControl variant="outlined" >
        <InputLabel >Tiêu chuẩn</InputLabel>
        <Select
          native
          value={newCriterion}
          label='Đơn vị'
          onChange={handleChangeCriterion}
        >
          <option aria-label="None" value="" />
          {data.map(x => {
            return (
              <option key={x._id} value={x.code}>{x.name}</option>
            )
          })}
        </Select>
      </FormControl>
      <Button style={{ marginLeft: 10, height: 56 }} variant="contained" color="primary" onClick={() => { newCriterion && addItem('criterion') }}>Thêm tiêu chuẩn</Button>
      <PostList postList={items}
        updateScore={updateScore}
        removeItem={removeItem}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openCriteria}
        onClose={handleCloseCriteria}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openCriteria}>
          <div className={classes.paper1}>
            <h4 id="transition-modal-title">Thêm tiêu chí cho tiêu chuẩn {chosen}</h4>
            <FormControl variant="outlined" >
              <InputLabel >Tiêu chí</InputLabel>
              <Select
                native
                value={newCriteria}
                label='Đơn vị'
                onChange={handleChangeCriteria}
              >
                <option aria-label="None" value="" />
                {chosen && data.find(x => x.code == chosen).criteria.map(y => {
                  return (
                    <option key={y._id} value={y.code}>{y.name}</option>
                  )
                })}
              </Select>
            </FormControl>
            <Button style={{ marginLeft: 10, height: 56 }} variant="contained" color="primary" onClick={() => { newCriteria && addItem('criteria') }}>Thêm tiêu chí</Button>
            <PostList postList={itemsCriteria}
              updateScore={updateScore}
              removeItem={removeItem}
            />
            <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={handleCloseCriteria}>Xong</Button>
          </div>
        </Fade>
      </Modal>
      <Button style={{position: 'absolute', right: 10, bottom: 10}} variant='contained' color='secondary' onClick={save}>Lưu Form</Button>
    </div>
  );
}