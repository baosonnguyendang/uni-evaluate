import React from 'react'
import { Grid, Avatar, Typography, Button, IconButton, Tabs, Tab, Box, Paper } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import SettingsIcon from '@material-ui/icons/Settings';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

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
            marginBottom:0
        }
      },
    iconbutton:{
        "&:hover": {
            backgroundColor:"transparent"
        }
    },
    listimage: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent:'center',
        '& > *': {
          margin: theme.spacing(1),
          width: theme.spacing(16),
          height: theme.spacing(16),
        },
    },
    paper:{
        height:250
    }
  }));

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`nav-tabpanel-${index}`}
        aria-labelledby={`nav-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

const Profile = () => {
    const classes = useStyles()
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        console.log(newValue)
        setValue(newValue);
    };

    return (
        <>
            <Grid container justify='center' md={10} style={{margin:'auto', marginTop: 30}} >
                <Grid container item xs={12} md={10} style={{marginBottom:25}}>
                    <Grid item xs>
                        <Avatar className={classes.avatar} alt='avatar' src='https://revelogue.com/wp-content/uploads/2019/12/Takaki-va-akari-trong-phim-e1576160716613.jpg' ></Avatar>
                    </Grid>
                    <Grid item xs >
                        <Typography variant='h6' style={{marginBottom:15}} >Omawae shinderu 
                            <Button style={{marginLeft:30}} variant="outlined" size="small">Edit Profile</Button> 
                            <IconButton><SettingsIcon/></IconButton> 
                        </Typography>
                        <div style={{marginBottom:25}}>
                            <div style={{display:"inline-block", marginRight:15}}>
                            <Typography><Typography style={{ fontWeight: 600, display:"inline-block" }}>132</Typography> posts</Typography>
                            </div>
                            
                            <div style={{display:"inline-block", marginRight:15}}>
                            <Typography><Typography style={{ fontWeight: 600, display:"inline-block" }}>325</Typography> followers</Typography>
                            </div>
                            <div style={{display:"inline-block"}}>
                            <Typography><Typography style={{ fontWeight: 600, display:"inline-block" }}>260</Typography> following</Typography>
                            </div>
                        </div>

                        <Typography style={{ fontWeight: 600}}>Siriwat Kunaporn</Typography>
                        <Typography>Bangkok Christian College</Typography>
                        <Typography>CU intania 96.</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Profile
