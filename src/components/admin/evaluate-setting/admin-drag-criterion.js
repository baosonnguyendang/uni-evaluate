import React, { useState, useEffect } from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

function PostButton(props) {
  let style = {
    margin: 10,
    height: 30,
  };
  return (
    <Button variant="contained" style={style} onClick={() => props.handleClick()}>{props.label}</Button>
    // <button style={style} onClick={() => props.handleClick()}>{props.label}</button>
  );
}

function PostText(props) {
  // let style = {
  //   lineHeight: '30px',
  //   marginTop: 10,
  // };
  return (
    // <div style={style}><span>{props.text}</span></div>
    <Typography style={ props.score ? {marginTop: 10, lineHeight: '30px'} : {textAlign: 'center'} }>{props.text}</Typography>
  );
}

function Post(props) {
  let style = {
    display: "flex",
  };
  return (
    // <div style={style}>
    //   <PostButton label='x' handleClick={props.removeItem} />
    //   <PostText text={props.title} style={{ width: '50%' }} />
    //   <PostButton label='+' handleClick={props.incrementScore} />
    //   <PostText text={props.score} width="20" />
    //   <PostButton label='-' handleClick={props.decrementScore} />
    // </div>
    <tr>
      <td><PostButton label='x' handleClick={props.removeItem} /></td>
      <td><PostText text={props.title} /></td>
      <td style={style}>
        <PostButton label='+' handleClick={props.incrementScore} />
        <PostText score={true} text={props.score} style={{lineHeight: 30}} />
        <PostButton label='-' handleClick={props.decrementScore} />
      </td>
    </tr>
  );
}

function PostList(props) {
  return (
    <table>
      <tr>
        <th></th>
        <th>Tên tiêu ch</th>
        <th style={{textAlign: 'center'}}>STT</th>

      </tr>
      {
        props.postList.map((item, index) => (
          <Post key={index}
            title={item.title}
            score={item.score}
            incrementScore={() => props.updateScore(index, 1)}
            decrementScore={() => props.updateScore(index, -1)}
            removeItem={() => props.removeItem(index)}
          />
        ))
      }
    </table>
  )
}

// function Post(props) {
//   let style = {
//     display: "flex"
//   };
//   return (
//     <div style={style}>
//       <PostButton label='x' handleClick={props.removeItem} />
//       <PostText text={props.title} style={{ width: '50%' }} />
//       <PostButton label='+' handleClick={props.incrementScore} />
//       <PostText text={props.score} width="20" />
//       <PostButton label='-' handleClick={props.decrementScore} />
//     </div>
//   );
// }

// function PostList(props) {
//   return (
//     <ol>
//       {
//         props.postList.map((item, index) => (
//           <Post key={index}
//             title={item.title}
//             score={item.score}
//             incrementScore={() => props.updateScore(index, 1)}
//             decrementScore={() => props.updateScore(index, -1)}
//             removeItem={() => props.removeItem(index)}
//           />
//         ))
//       }
//     </ol>
//   )
// }


export default function Drag() {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     value: "",
  //     items: []
  //   }
  // }
  const [items, setItems] = useState([])
  // const handleChange(event) {
  //   this.setState({ value: event.target.value });
  // }

  const [newValue, setNewValue] = React.useState('');
  const handleChangeValue = (event) => {
    setNewValue(event.target.value);
  };

  const addItem = () => {
    let itemsCopy = items.slice();
    let truncatedString = newValue;
    itemsCopy.push({ "title": truncatedString, "score": 0 })
    itemsCopy.sort((a, b) => {
      return b.score - a.score;
    })
    setItems(itemsCopy)
    setNewValue('')
    // this.setState({ items: itemsCopy, value: '' });
  }

  const updateScore = (index, val) => {
    let itemsCopy = items.slice();
    itemsCopy[index].score += val;
    itemsCopy.sort((a, b) => {
      return b.score - a.score;
    })
    setItems(itemsCopy)
    // this.setState({ items: itemsCopy });
  }

  const removeItem = (index) => {
    var itemsCopy = items.slice();
    itemsCopy.splice(index, 1);
    itemsCopy.sort((a, b) => {
      return b.score - a.score;
    });
    setItems(itemsCopy)
    // this.setState({ items: itemsCopy });
  }

  return (
    <div>
      <FormControl variant="outlined" >
        <InputLabel >Đơn vị</InputLabel>
        <Select
          native
          value={newValue}
          label='Đơn vị'
          onChange={handleChangeValue}
        >
          <option aria-label="None" value="" />
          <option value={10}>Định mức giờ chuẩn hoàn thành</option>
          <option value={20}>Kết quả khảo sát chất lượng dịch vụ</option>
          <option value={30}>Hình thức giảng dạy khác</option>
        </Select>
      </FormControl>
      {/* <input value={this.state.value} onChange={this.handleChange.bind(this)} /> */}
      {/* <button onClick={() => addItem()}>Thêm</button> */}
      <Button style={{ marginLeft: 10, height: 56 }} variant="contained" color="primary" onClick={() => addItem()}>Thêm tiêu ch</Button>
      <PostList postList={items}
        updateScore={updateScore}
        removeItem={removeItem} />
    </div>
  );
}
