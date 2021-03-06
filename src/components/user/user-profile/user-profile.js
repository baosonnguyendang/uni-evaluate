import React, { useState, useEffect } from 'react'
import { Grid, Avatar, Typography, Button } from '@material-ui/core'
import { makeStyles, LinearProgress } from '@material-ui/core';
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
}));

const Profile = () => {
  const classes = useStyles()
  const [edit, setEdit] = React.useState(false)
  const [editPassword, setEditPassword] = React.useState(false)
  const [loading, setLoading] = useState(true)
  // info of user
  const [infoUser, setInfoUser] = useState({})


  //fetch user info
  useEffect(() => {
    const fetchInfoUser = () => {
      axios.get('/user')
        .then(res => {
          // console.log(res.data)
          setInfoUser(res.data.user)
          setLoading(false)
        })
        .catch(e => {
          console.log(e)
          setLoading(false)
        })
    }
    fetchInfoUser()
  }, [])
  const onEdit = () => {
    setEditPassword(false)
    setEdit(true)
  }
  const onEditPassword = () => {
    setEdit(false)
    setEditPassword(true)
  }
  const updateUser = (lastname, firstname, gender, birthday, phone) => {
    setInfoUser(state => ({ ...state, lastname, firstname, gender, birthday, phone }))
  }
  return (
    <>
      {loading ? <LinearProgress style={{ position: "absolute", width: "100%" }} /> :
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
                {infoUser.gender === 'Male' && 'Nam'}
                {infoUser.gender === 'Female' && 'N???'}
                {infoUser.gender === 'Other' && 'Kh??c'}
              </Typography>
              <Typography style={{ marginBottom: 25 }}>
                {moment(infoUser.birthday).format('DD/MM/yyyy')}
              </Typography>
              <Typography>
                {infoUser.staff_id}
              </Typography>

              <Typography>{infoUser.phone}</Typography>
              <Typography>{infoUser.email}</Typography>
              <Button style={{ marginTop: 30, marginRight: 20 }} variant="outlined" size="small" onClick={onEdit}>Ch???nh s???a</Button>
              <Button style={{ marginTop: 30 }} variant="outlined" size="small" onClick={onEditPassword}>?????i m???t kh???u</Button>
            </Grid>}
          {edit && <EditUserForm setEdit={() => setEdit(false)} infoUser={infoUser} updateUser={updateUser} />}
          {editPassword && <EditPassword setDisableEditPassword={() => setEditPassword(false)} />}
        </Grid>}


    </>
  )
}

export default Profile
