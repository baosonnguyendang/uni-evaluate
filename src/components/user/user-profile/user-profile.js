import React from 'react'
import { Grid, Avatar, Typography, Button, IconButton, Tabs, Tab, Box, Paper } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import SettingsIcon from '@material-ui/icons/Settings';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import CustomTextField from '../../common/CustomTextField'
import EditUserForm from './user-editprofile'
import EditPassword from './user-editpassword'
const useStyles = makeStyles(theme => ({
  avatar: {
    width: 150,
    height: 150,
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
      <Grid container justify='center' md={10} style={{ margin: 'auto', marginTop: 30 }} >
        <Grid container item xs={12} md={10} style={{ marginBottom: 25 }}>
          <Grid item xs>
            <Avatar className={classes.avatar} alt='avatar' src='https://revelogue.com/wp-content/uploads/2019/12/Takaki-va-akari-trong-phim-e1576160716613.jpg' ></Avatar>
          </Grid>
          <Grid item xs >
            <Typography variant='h6' style={{ marginBottom: 15 }} >Nguyễn Văn A
            </Typography>
            <Typography>
              Nam
            </Typography>
            <Typography style={{ marginBottom: 25 }}>
              19/5/1985
            </Typography>
            <Typography>
              MT-003
            </Typography>

            <Typography>0914387749</Typography>
            <Typography>testA@gmail.com</Typography>
            <Button style={{ marginTop: 30, marginRight: 20}} variant="outlined" size="small" onClick={onEdit}>Chỉnh sửa</Button>
            <Button style={{ marginTop: 30 }} variant="outlined" size="small" onClick={onEditPassword}>Đổi mật khẩu</Button>
          </Grid>
        </Grid>
        {edit && <EditUserForm setEdit={() => setEdit(false)} />}
        {editPassword && <EditPassword setEditPassword={() => setEditPassword(false)}/>}
      </Grid>

    </>
  )
}

export default Profile
