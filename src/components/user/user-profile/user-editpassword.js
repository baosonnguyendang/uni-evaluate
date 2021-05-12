import React from 'react'
import { TextField, Grid, Button } from '@material-ui/core';

const EditUserForm = ({ setEditPassword }) => {
    return (
        <Grid container alignItems="center" spacing={3} md={6} style={{ paddingTop: '30px' }} >
            <Grid item xs={12} >
                <TextField required label="Mật khẩu cũ" defaultValue="" type='password' fullWidth />
            </Grid>
            <Grid item xs={12} >
                <TextField required label="Mật khẩu mới" defaultValue="" type='password' fullWidth />
            </Grid>
            <Grid item xs={12} >
                <TextField required label="Nhập lại mật khẩu mới" defaultValue="" type='password' fullWidth />
            </Grid>
            <Grid item container xs={12} justify="flex-end">
                <Button variant="contained" style={{ marginRight: '20px' }} onClick={() => setEditPassword()}>
                    Huỷ
                </Button>
                <Button variant="contained" color="primary">
                    Lưu
                </Button>
            </Grid>
        </Grid>
    )
}

export default EditUserForm
