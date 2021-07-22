import React, { useState, useEffect } from 'react'
import { TextField, Grid, makeStyles, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@material-ui/core';
import moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import MomentUtils from '@date-io/moment';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'
import Loading from '../../common/Loading'

// validate phone
function validatePhone(phone) {
    if (phone === '') return true
    const re = /(84|0[3|5|7|8|9])+([0-9]{8})+\b/g;
    return re.test(String(phone).toLowerCase());
}

const useStyles = makeStyles(theme => ({
    error: {
        color: 'red',
    },
}))

const EditUserForm = ({ setEdit, infoUser, updateUser }) => {
    const { register, handleSubmit, formState: { errors }, control } = useForm({
        defaultValues: {
            firstname: infoUser.firstname,
            lastname: infoUser.lastname,
            phone: infoUser.phone
        }
    })
    const dispatch = useDispatch()

    const [date, setDate] = useState(infoUser.birthday);
    const [gender, setGender] = useState(infoUser.gender)

    const handleChange = (event) => {
        setGender(event.target.value);
    };
    const classes = useStyles()
    const editProfile = (body) => {

        axios.post('/user/editUser', body)
            .then(res => {
                // console.log(res.data)
                updateUser(body.lname, body.fname, body.gender, body.birthday, body.phone)
                dispatch(showSuccessSnackbar('Cập nhật thông tin thành công'))
                setLoading(false)
                setEdit()
            })
            .catch(e => {
                console.log(e)
                dispatch(showErrorSnackbar('Cập nhật thông tin thất bại'))
                setLoading(false)
            })
    }
    //submit edit profile
    const submit = (data) => {
        setLoading(true)
        const body = { fname: data.firstname, lname: data.lastname, phone: data.phone, gender, birthday: date && moment(date).toString() }
        editProfile(body)
    }
    // handle button loading 

    const [loading, setLoading] = useState(false)
    return (
        <form onSubmit={handleSubmit(submit)}>
            <Loading open={loading} />
            <Grid item container alignItems="center" xs={12} md={4} style={{ padding: '30px 0 ', margin: 'auto' }} >
                <Grid item xs={12} >
                    <Controller
                        control={control}
                        name="lastname"
                        render={({ field }) => (
                            <TextField {...field} margin='normal' autoFocus label="Họ và tên lót" fullWidth />
                        )}
                        rules={{ required: "Vui lòng nhập họ và tên lót" }}
                    />
                    <Typography className={classes.error}>{errors?.lastname && errors.lastname.message}</Typography>
                </Grid>
                <Grid item xs={12} >
                    <Controller
                        control={control}
                        name="firstname"
                        render={({ field }) => (
                            <TextField {...field} margin='normal' label="Tên" fullWidth />
                        )}
                        rules={{ required: "Vui lòng nhập tên" }}
                    />
                    <Typography className={classes.error}>{errors?.firstname && errors.firstname.message}</Typography>
                </Grid>
                <Grid item xs={12} >
                    <FormControl fullWidth margin='normal'>
                        <InputLabel>
                            Giới tính
                        </InputLabel>
                        <Select
                            value={gender}
                            onChange={handleChange}
                        >
                            <MenuItem value={'Male'}>Nam</MenuItem>
                            <MenuItem value={'Female'}>Nữ</MenuItem>
                            <MenuItem value={'Other'}>Khác</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} >
                    <MuiPickersUtilsProvider utils={MomentUtils} >
                        <KeyboardDatePicker
                            fullWidth
                            margin='normal'
                            label="Ngày sinh"
                            value={date}
                            onChange={setDate}
                            onError={console.log}
                            disableFuture
                            disableToolbar
                            format="DD/MM/yyyy"
                            minDateMessage='Ngày sinh không đúng'
                            invalidDateMessage='Ngày sinh không hợp lệ'
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} >
                    <TextField margin='normal' label="Mã nhân viên" defaultValue={infoUser.staff_id} fullWidth disabled />
                </Grid>
                <Grid item xs={12} >
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                            <TextField {...field} margin='normal' label="Số điện thoại" fullWidth />
                        )}
                        rules={{ validate: value => validatePhone(value) || "Số điện thoại không đúng" }}
                    />
                    <Typography className={classes.error}>{errors?.phone && errors.phone.message}</Typography>
                </Grid>
                <Grid item xs={12} >
                    <TextField margin='normal' label="Email" defaultValue={infoUser.email} fullWidth disabled />
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
