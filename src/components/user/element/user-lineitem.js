import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import {Link} from 'react-router-dom'
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function InsetList({data}) {
  const classes = useStyles();

  return (
    <List component="nav" className={classes.root} aria-label="contacts">
        {data.map(item=>(
        <ListItem button key={item.id} component={Link} to={`/user/evaluate/${item.id}`}>
            <ListItemText inset primary={item.name} />
        </ListItem>))}
      
    </List>
  );
}
