import React, { useState }from 'react'
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { blue } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonProgress: {
    //   color: '#303f9f',
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }));

const ButtonCustom = ({loading, handleButtonClick, children , ...rest }) => {
    const classes = useStyles()
    const onClick = () => {
        handleButtonClick()
    }
    return (
      <div className={classes.wrapper}>
        <Button
          disabled={loading}
          {...rest}
        >
          {children}
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
    )
}

export default ButtonCustom
