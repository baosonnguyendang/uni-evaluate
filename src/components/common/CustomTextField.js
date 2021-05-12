import React from 'react'
import { TextField, Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
const CustomTextField = ({ name, label }) => {
    const { control } = useForm();
    return (
        <Grid item xs={12} >
            <Controller
                as={TextField}
                control={control}
                fullWidth
                name={name}â
                label={label}
                required
                defaultValue=''
            />
        </Grid>
    )
}

export default CustomTextField
