import React from 'react'
import { Grid,Typography } from "@material-ui/core";
import Calendar from 'react-calendar'
import { makeStyles } from "@material-ui/core";
import Line from './element/user-listline'
import Line1 from './element/user-lineitem'
const data = [{id:1, name:"Đánh giá cuối năm 2019"},{id:2, name:"Đánh giá cuối năm 2020"},{id:3, name:"Đánh giá cuối năm"},]

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    task: {
      flexGrow:1,
      minWidth:700
    },
    item: {
        marginBottom: theme.spacing(3)
      }
}))

const Main = () => {
    const [value, onChange] = React.useState(new Date());
    const classes = useStyles()
    return (
        <div>
            <Grid container item xs={12}  className={classes.root}>
              <Grid xs={12} className={classes.item}>
                <Typography variant='h4'> List form evaluation</Typography>
              </Grid>
              <Grid className={classes.task}>
                  <Line1 data={data}/>
                  {/* <Paper className={classes.paper}>
                    <BasicTable />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Faculty />
                  </Paper> */}
                  {/* <Switch> 
                    <Route path='/user/info' children={<Info className={classes.paper}/>} />
                    <Route path='/user/evaluate' exact children={<Evaluation className={classes.paper}/>} />
                    <Route path='/user/evaluate/id' exact children={<Evaluate className={classes.paper}/>} />
                  </Switch> */}
                </Grid>
                <Grid style={{width:350}}>
                <Calendar
                  onChange={onChange}
                  value={value}
                />
                </Grid>
            </Grid>
        </div>
    )
}

export default Main
