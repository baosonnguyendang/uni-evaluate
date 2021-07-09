import React from 'react';
import { Typography } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";

const NotFound = () => {
    const history = useHistory();
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            right: '50%',
            transform: 'translate(50%, -70%)',
            textAlign: 'center'
        }}>
            <br />
            <Typography variant="h1" style={{ fontSize: '20rem' }} >
                403
            </Typography>
            <Typography variant="h3">
                Không có quyền truy cập
            </Typography>
            <br />
            <Typography variant='h5' component={Link} to='#' onClick={() => history.goBack()}>
                Quay lại
            </Typography>
     
        </div>
    )
}

export default NotFound;