import * as React from 'react';
import ReactDOM from 'react-dom';
import Paper from '@material-ui/core/Paper';

function ListItem(props) {
  // Correct! There is no need to specify the key here:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Correct! Key should be specified inside the array.
    <ListItem key={number.toString()} value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];

// ReactDOM.render(
//   <NumberList numbers={numbers} />,
//   document.getElementById('root')
// );

export default class EvaluateList extends React.Component {
  render (){
    return (
      <Paper>
        <NumberList numbers={numbers} />
      </Paper>
    )
  }
}