import React from 'react'
import { TextField, Grid, Button } from '@material-ui/core';
import moment from 'moment'
const EditUserForm = ({ setEdit, infoUser }) => {
    return (
        <form>
            <Grid item container alignItems="center" spacing={3} md={6} style={{ paddingTop: '30px', margin: 'auto' }} >
                <Grid item xs={12} >
                    <TextField required label="Họ và tên lót" defaultValue={infoUser.lastname} fullWidth />
                </Grid>
                <Grid item xs={12} >
                    <TextField required label="Tên" defaultValue={infoUser.firstname} fullWidth />
                </Grid>
                <Grid item xs={12} >
                    <TextField label="Ngày sinh" defaultValue={moment(infoUser.birthday).format('DD/MM/yyyy')} fullWidth />
                </Grid>
                <Grid item xs={12} >
                    <TextField required label="Mã nhân viên" defaultValue={infoUser.staff_id} fullWidth disabled />
                </Grid>
                <Grid item xs={12} >
                    <TextField label="Số điện thoại" defaultValue={infoUser.phone} fullWidth />
                </Grid>
                <Grid item xs={12} >
                    <TextField required label="Email" defaultValue={infoUser.email} fullWidth disabled />
                </Grid>
                <Grid item container xs={12} justify="flex-end">
                    <Button variant="contained" style={{ marginRight: '20px' }} onClick={() => setEdit()}>
                        Huỷ
                </Button>
                    <Button type='submit' variant="contained" color="primary">
                        Lưu
                </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default EditUserForm
