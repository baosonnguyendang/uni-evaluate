import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const CircleLoading = () => {
    const classes = useStyles()
    return (
        <div className={classes.body}>
            <CircularProgress/> 
        </div>
    )
}

export default CircleLoading
