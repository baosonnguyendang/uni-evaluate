import React, { useState, useEffect } from 'react'
import { Grid, Avatar, Typography, Button, IconButton, Tabs, Tab, Box, Paper } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import SettingsIcon from '@material-ui/icons/Settings';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import CustomTextField from '../../common/CustomTextField'
import EditUserForm from './user-editprofile'
import EditPassword from './user-editpassword'
import axios from 'axios'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
  avatar: {
    width: 250,
    height: 250,
    margin: 'auto'
  },
  tabs: {
    borderTop: `1px solid ${theme.palette.divider}`,
    "& .MuiTab-wrapper": {
      flexDirection: "row",
    },
    "& .MuiTab-labelIcon .MuiTab-wrapper > *:first-child": {
      marginBottom: 0
    }
  },
  iconbutton: {
    "&:hover": {
      backgroundColor: "transparent"
    }
  },
  listimage: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
  paper: {
    height: 250
  }
}));

const Profile = () => {
  const classes = useStyles()
  const [value, setValue] = React.useState(0);
  const [edit, setEdit] = React.useState(false)
  const [editPassword, setEditPassword] = React.useState(false)
  const [loading, setLoading] = useState(true)
  // info of user
  const [infoUser, setInfoUser] = useState({})
  // config token
  const token = localStorage.getItem('token')
  const config = { headers: { "Authorization": `Bearer ${token}` } }
  const fetchInfoUser = () => {
    axios.get('/user',config)
      .then(res => {
        console.log(res.data)
        setInfoUser(res.data.user)
      })
  }
  //fetch user info
  useEffect(() => {
    fetchInfoUser()
  },[])
  const onEdit = () => {
    setEditPassword(false)
    setEdit(true)
  }
  const onEditPassword = () => {
    setEdit(false)
    setEditPassword(true)
  }
  const handleChange = (event, newValue) => {
    console.log(newValue)
    setValue(newValue);
  };

  return (
    <>
      <Grid container justify='center' style={{ margin: 'auto', marginTop: 30 }} direction="column" >
        <Grid item >
          <Avatar className={classes.avatar} alt='avatar' src='https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg' ></Avatar>
        </Grid>
        {!edit &&
          <Grid item style={{ paddingTop: '30px', margin: 'auto' }} >
            <Typography variant='h6' style={{ marginBottom: 15 }} >
              {infoUser.lastname} {infoUser.firstname}
            </Typography>
            <Typography>
              {infoUser.gender === 'Female' ? 'Nam' : 'Nữ'}
            </Typography>
            <Typography style={{ marginBottom: 25 }}>
              {moment(infoUser.birthday).format('DD/MM/yyyy')}
            </Typography>
            <Typography>
              {infoUser.staff_id}
            </Typography>

            <Typography>{infoUser.phone}</Typography>
            <Typography>{infoUser.email}</Typography>
            <Button style={{ marginTop: 30, marginRight: 20 }} variant="outlined" size="small" onClick={onEdit}>Chỉnh sửa</Button>
            <Button style={{ marginTop: 30 }} variant="outlined" size="small" onClick={onEditPassword}>Đổi mật khẩu</Button>
          </Grid>}
        {edit && <EditUserForm setEdit={() => setEdit(false)} infoUser={infoUser} />}
        {editPassword && <EditPassword setEditPassword={() => setEditPassword(false)} />}




      </Grid>

    </>
  )
}

export default Profile
