import React from 'react';
import { Button, Typography } from '@material-ui/core'


const FileUploader = props => {
    const hiddenFileInput = React.useRef(null);
    const [name, setName] = React.useState(null)

    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        setName(event.target.files[0].name)
        // props.handleFile(fileUploaded);
    };
    return (
        <>
        <Typography variant='h5' gutterBottom >Thêm danh sách người dùng</Typography>
            <form onSubmit={props.submit} >
                <Button onClick={handleClick} variant="contained" size="small">
                    Chọn file excel
                </Button>
                <br />
                <br />
                <input type="file"
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
                <div style={{height:'150px'}}>
                <Typography>{name}</Typography>
                </div>
                <br />
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary" >Import</Button>
                    <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={props.handleClose}>Thoát</Button>
                </div>
            </form>
        </>
    );
};
export default FileUploader;