import React from 'react'
import { TextField, Grid, Button } from '@material-ui/core';
import moment from 'moment'
import ButtonCustom from '../../common/ButtonCustom'

const EditUserForm = ({ setEdit, infoUser }) => {
    return (
        <form>
            <Grid item container alignItems="center" xs={12} md={4} style={{ paddingTop: '30px', margin: 'auto' }} >
                <Grid item xs={12} >
                    <TextField autoFocus margin='normal' label="Họ và tên lót" defaultValue={infoUser.lastname} fullWidth />
                </Grid>
                <Grid item xs={12} >
                    <TextField  margin='normal' label="Tên" defaultValue={infoUser.firstname} fullWidth />
                </Grid>
                <Grid item xs={12} >
                    <TextField label="Ngày sinh" defaultValue={moment(infoUser.birthday).format('DD/MM/yyyy')} fullWidth />
                </Grid>
                <Grid item xs={12} >
                    <TextField  margin='normal' label="Mã nhân viên" defaultValue={infoUser.staff_id} fullWidth disabled />
                </Grid>
                <Grid item xs={12} >
                    <TextField label="Số điện thoại" defaultValue={infoUser.phone} fullWidth />
                </Grid>
                <Grid item xs={12} >
                    <TextField  margin='normal' label="Email" defaultValue={infoUser.email} fullWidth disabled />
                </Grid>
                <Grid item container xs={12} justify="flex-end">
                    <ButtonCustom variant="contained" style={{ marginRight: '20px' }} onClick={() => setEdit()}>
                        Huỷ
                </ButtonCustom>
                    <ButtonCustom type='submit' variant="contained" color="primary">
                        Lưu
                </ButtonCustom>
                </Grid>
            </Grid>
        </form>
    )
}

export default EditUserForm
