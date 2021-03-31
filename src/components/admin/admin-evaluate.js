import * as React from 'react';
import ReactDOM from 'react-dom';

import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

function ListItem(props) {
  // Correct! There is no need to specify the key here:
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

// ReactDOM.render(
//   <NumberList numbers={numbers} />,
//   document.getElementById('root')
// );

export default class EvaluateList extends React.Component {
  render() {
    return (
      <Paper>
        <Typography component="h1" variant="h6" color="inherit" noWrap>
          Đợt đánh giá
        </Typography>
        <NumberList numbers={numbers} />
      </Paper>
    )
  }
}