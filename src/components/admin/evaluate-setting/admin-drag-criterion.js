import React, { useState, useEffect } from 'react';

import axios from 'axios';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField'

import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper1: {
    position: 'absolute',
    width: 700,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minHeight: 250,
  },
}))

export default function Drag(props) {
  // mã form
  const { fcode } = props;

  //css
  const classes = useStyles();

  //phai an luu form 1 lan moi co the vao them tieu chi dc
  const [disabled, setDisabled] = React.useState(true)

  //cai nay la de luu tam data, data thay doi thi moi an luu duoc, tranh lam kho backend
  const [luuTam, setLuuTam] = React.useState([])

  //cái này là để mở cái modal chỉnh tiêu chí
  const [openCriteria, setOpenCriteria] = React.useState(false);
  const handleCloseCriteria = () => {
    setOpenCriteria(false);
    // items.find(x => x.code == chosen).criteria = itemsCriteria
  }

  // thêm tiêu chí vào tiêu chuẩn thuộc form
  const submitAddFormCriteria = () =>{
    const scode = chosen //mã tiêu chuẩn
    //request body
    const body = {
        criterions: itemsCriteria.map(item => {
          return {
            code: item.code, //mã tiêu chí
            point: item.pts, // điểm tối đa
            order: item.score // stt
          }
        }),
    }
    axios.post(`/admin/form/${fcode}/standard/${scode}/addFormCriteria`, body, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        
        handleCloseCriteria(); // tắt modal
      })
      .catch(err => {

      })
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
      //setItemsCriteria(items.find(item => item.code == x).criteria) 
      axios.get(`/admin/form/${fcode}/standard/${x}/getFormCriteria`, { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => {
          console.log(res.data.formCriteria)
          let temp = []
          res.data.formCriteria.map(x => {
            let obj = {'code': x.criteria_id.code, 'score': parseInt(x.criteria_order), 'pts': x.point, 'title': x.criteria_id.name}
            temp.push(obj)
          })
          setItemsCriteria(temp)
          console.log(itemsCriteria)
          setOpenCriteria(true)
        })
        .catch(err => {

        })
    }

    const setPoint = (e) => {
      openCriteria ? (itemsCriteria.find(x => x.code === props.code).pts = e) : (items.find(x => x.code === props.code).pts = e)
    }

    return (
      <tr>
        <td><PostButton label='x' handleClick={props.removeItem} /></td>
        <td><span type={!openCriteria && 'button'} onClick={() => { disabled && !openCriteria && handleOpen(props.code) }}><PostText text={props.title} /></span></td>
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
            <th style={{ textAlign: 'center' }}>{openCriteria ? 'Tên tiêu chí' : 'Tên tiêu chuẩn'}</th>
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

  //them 1 cai thuoc tinh cho tieuchuan, true thi tuc la duoc chon de them vao form
  const createData = (x) => ({ ...x, clicked: false })

  //cai tren la ds tieu chuan, cai duoi la ds tieu chi duoc chon de them vao form
  const [items, setItems] = useState([])
  const [itemsCriteria, setItemsCriteria] = useState([])

  const token = localStorage.getItem('token')
  const fetchCriterion = () => {
    axios.get('admin/standard/criteria', { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        let temp = res.data.standards.map(x => createData(x))
        axios.get(`/admin/form/${fcode}/getFormStandard`, { headers: { "Authorization": `Bearer ${token}` } })
          .then(res => {
            let temp2 = []
            res.data.formStandards.map(x => {
              let obj = { "title": x.standard_id.name, "score": x.standard_order, "code": x.standard_id.code, "pts": x.standard_point, "criteria": [] }
              temp.find(x => x.code == obj.code).clicked = true
              temp2.push(obj)
            })
            function dynamicSort(property) {
              var sortOrder = 1;
              if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
              }
              return function (a, b) {
                /* next line works with strings and numbers, 
                 * and you may want to customize it to your needs
                 */
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
              }
            }

            temp2.sort(dynamicSort('score'))
            setData(temp)
            setItems(temp2)
            setLuuTam(temp2)
          })
          .catch(e => {
            console.log(e)
          })
      })
      .catch(e => {
        console.log(e)
      })
  }

  useEffect(() => {
    if (data.length === 0) {
      fetchCriterion()
    }
    if (items == luuTam) {
      setDisabled(true)
    }
    else {
      setDisabled(false)
    }
  }, [])

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

  //them tieu chuan (tieu chi) vao form
  const addItem = (type) => {
    let itemsCopy = type === 'criterion' ? items.slice() : itemsCriteria.slice()
    let truncatedString = (type === 'criterion' ? data.find(x => x.code == newCriterion).name : (chosen && data.find(x => x.code == chosen).criteria.find(y => y.code == newCriteria).name)); //data.find(x => x.code == value).name
    //itemsCopy.push({ "title": truncatedString, "score": itemsCopy.length + 1, "code": type === 'criterion' ? newCriterion : newCriteria, "pts": 5 })
    if (type === 'criterion') {
      itemsCopy.push({ "title": truncatedString, "score": itemsCopy.length + 1, "code": newCriterion, "pts": 5 })
    } else {
      itemsCopy.push({ "title": truncatedString, "score": itemsCopy.length + 1, "code": newCriteria, "pts": 5 })
      console.log(itemsCopy)
    }

    itemsCopy.sort((a, b) => {
      return a.score - b.score;
    })
    if (type === 'criterion') {
      data.find(x => x.code == newCriterion).clicked = true
      setItems(itemsCopy)
      setNewCriterion('')
    } else {
      setItemsCriteria(itemsCopy)
      console.log(itemsCopy)
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
    // this.setState({ items: itemsCopy });
  }

  const removeItem = (index) => {
    var itemsCopy = openCriteria ? itemsCriteria.slice() : items.slice();
    itemsCopy.splice(index, 1);
    itemsCopy.sort((a, b) => {
      return a.score - b.score;
    });
    if (openCriteria) {
      setItemsCriteria(itemsCopy)
    } else {
      setItems(itemsCopy)
      let temp = data.filter(x => x.clicked == true).map(y => y.code).filter(e => !itemsCopy.map(z => z.code).includes(e));
      if (data.find(x => x.code == temp)) {
        data.find(x => x.code == temp).clicked = false
      }
      // itemsCopy.map(x => x.code)
    }
  }

  //reset nhe cai form
  // const undo = () => {
  //   setItems(luuTam)
  //   setDisabled(true)
  // }

  //luu nhe cai form
  const save = () => {
    const body = {
      standards_code: items.map(item => {
        return {
          code: item.code,
          point: item.pts,
          order: item.score
        }
      }),
    }
    console.log(items)
    if (new Set(items.map(x => x.score)).size !== items.map(x => x.score).length) {
      alert('Kiểm tra lại STT')
    } else {

      axios.post(`/admin/form/${fcode}/addFormStandard`, body, { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => {
          console.log(items)
          setDisabled(true);
          setLuuTam(items)
        })
        .catch(err => {

        })
    }
  }

  //huy sua tieu chi, ve lai nhu cu luc moi mo 
  const cancel = () => {
    handleCloseCriteria()
  }

  return (
    <div>
      <FormControl variant="outlined" >
        <InputLabel >Tiêu chuẩn </InputLabel>
        <Select
          style={{minWidth: '300px'}}
          native
          value={newCriterion}
          onChange={handleChangeCriterion}
        >
          <option value="" disabled />
          {data.filter(x => x.clicked == false).map(x => {
            return (
              <option key={x._id} value={x.code}>{x.name}</option >
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
              <InputLabel >Tiêu chí </InputLabel>
              <Select
                style={{minWidth: '300px'}}
                native
                value={newCriteria}
                label='Đơn vị'
                onChange={handleChangeCriteria}
              >
                <option value="" disabled />
                {chosen && data.find(x => x.code == chosen).criteria.map(y => {
                  if (!itemsCriteria.map(z => z.code).includes(y.code)) {
                    return (
                      <option key={y._id} value={y.code}>{y.name}</option>
                    )
                  }
                })}
              </Select>
            </FormControl>
            <Button style={{ marginLeft: 10, height: 56 }} variant="contained" color="primary" onClick={() => { newCriteria && addItem('criteria') }}>Thêm tiêu chí</Button>
            <PostList postList={itemsCriteria}
              updateScore={updateScore}
              removeItem={removeItem}
            />
            <div style={{ marginTop: '10px', textAlign: 'center' }} >
              <Button variant="contained" color="primary" onClick={submitAddFormCriteria}>Lưu và thoát</Button>
              <Button style={{marginLeft: 10}} variant="contained" color="secondary" onClick={cancel}>Thoát</Button>
            </div>
          </div>
        </Fade>
      </Modal>
      <div style={{ position: 'absolute', right: 10, bottom: 10 }}>
        {/* <Button style={{ marginRight: 10 }} variant='contained' color='primary' onClick={undo}>Undo</Button> */}
        <Button variant='contained' disabled={disabled} color='secondary' onClick={save}>Lưu Form</Button>
      </div>
    </div>
  );
}