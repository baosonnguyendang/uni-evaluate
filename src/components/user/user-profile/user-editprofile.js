import React from 'react'
import { TextField, Grid, Button } from '@material-ui/core';

const EditUserForm = ({ setEdit }) => {
    return (
        <Grid container alignItems="center" spacing={3} md={6} style={{ paddingTop: '30px' }} >
            <Grid item xs={12} >
                <TextField required label="Họ" defaultValue="Nguyễn Văn" fullWidth />
            </Grid>
            <Grid item xs={12} >
                <TextField required label="Tên" defaultValue="A" fullWidth />
            </Grid>
            <Grid item xs={12} >
                <TextField required label="Ngày sinh" defaultValue="19/5/1985" fullWidth />
            </Grid>
            <Grid item xs={12} >
                <TextField required label="Mã nhân viên" defaultValue="MT-003" fullWidth disabled />
            </Grid>
            <Grid item xs={12} >
                <TextField required label="Số điện thoại" defaultValue="0914387749" fullWidth />
            </Grid>
            <Grid item xs={12} >
                <TextField required label="Email" defaultValue="testA@gmail.com" fullWidth disabled />
            </Grid>
            <Grid item container xs={12} justify="flex-end">
                <Button variant="contained" style={{ marginRight: '20px' }} onClick={() => setEdit()}>
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
