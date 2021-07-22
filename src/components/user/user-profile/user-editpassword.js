import React, { useRef, useState } from 'react'
import { TextField, Grid, Button, Typography } from '@material-ui/core';
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { makeStyles } from '@material-ui/core';
import Loading from '../../common/Loading'
import { useDispatch } from 'react-redux'
import { showSuccessSnackbar, showErrorSnackbar } from '../../../actions/notifyAction'

const useStyles = makeStyles(theme => ({
    error: {
        color: 'red',
    },
}))

const EditUserForm = ({ setDisableEditPassword }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const { register, handleSubmit, formState: { errors }, watch } = useForm()
    const newpassword = useRef({});
    newpassword.current = watch("newpassword", "");

    const submit = data => {

        if (data.oldpassword === data.newpassword) {
            // console.log(data.oldpasword === data.newpassword)
            dispatch(showErrorSnackbar('Mật khẩu mới không được giống mật khẩu cũ'))
            setLoading(false)
            return
        }
        const postData = {
            old_password: data.oldpassword,
            new_password: data.newpassword
        }
        setLoading(true)
        axios.post('/user/changePassword', postData)
            .then(res => {
                dispatch(showSuccessSnackbar('Đổi mật khẩu thành công'))
                setLoading(false)
                setDisableEditPassword()
            })
            .catch(e => {
                setLoading(false)
                dispatch(showErrorSnackbar('Mật khẩu cũ không đúng'))
            })
    }
    const [loading, setLoading] = useState(false)
    return (
        <form onSubmit={handleSubmit(submit)}>
            <Loading open={loading} />
            <Grid item container alignItems="center" md={4} xs={12} style={{ padding: '30px 0', margin: 'auto' }} >
                <Grid item xs={12} >
                    <TextField label="Mật khẩu cũ" autoFocus margin='normal' type='password' fullWidth
                        {...register('oldpassword', {
                            required: "Vui lòng nhập mật khẩu cũ",
                            minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 kí tự" }
                        })} />
                    <Typography className={classes.error}>{errors?.oldpassword && errors.oldpassword.message}</Typography>
                </Grid>
                <Grid item xs={12} >
                    <TextField label="Mật khẩu mới" margin='normal' type='password' fullWidth
                        {...register('newpassword', {
                            required: 'Vui lòng nhập mật khẩu mới',
                            minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 kí tự" }
                        })} />
                    <Typography className={classes.error}>{errors?.newpassword && errors.newpassword.message}</Typography>
                </Grid>
                <Grid item xs={12} >
                    <TextField label="Nhập lại mật khẩu mới" margin='normal' type='password' fullWidth {...register('repeatnewpassword', {
                        required: 'Vui lòng nhập lại mật khẩu mới',
                        validate: value => value === newpassword.current || "Mật khẩu nhập lại không đúng"
                    })} />
                    <Typography className={classes.error} variant='subtitle1'>{errors?.repeatnewpassword && errors.repeatnewpassword.message}</Typography>
                </Grid>
                <Grid item container xs={12} justify="flex-end">
                    <Button variant="contained" style={{ marginRight: '20px' }} onClick={setDisableEditPassword} type='submit'>
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
