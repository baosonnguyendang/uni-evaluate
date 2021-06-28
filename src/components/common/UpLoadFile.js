import React from 'react';
import { Button, Typography } from '@material-ui/core'

const FileUploader = props => {
  const hiddenFileInput = React.useRef(null);
  const [file, setFile] = React.useState({})

  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleChange = event => {
    setFile(event.target.files[0])
  };

  return (
    <>
      <Typography variant='h5' gutterBottom >{props.title}</Typography>
      <form  >
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
        <div style={{ height: '150px' }}>
          <Typography>{file.name}</Typography>
        </div>
        <br />
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Button style={{ marginRight: '10px' }} variant="contained" color="primary" onClick={() => props.submit(file)} >Import</Button>
          <Button style={{ marginLeft: '10px' }} variant="contained" color="primary" onClick={props.handleClose}>Thoát</Button>
        </div>
      </form>
    </>
  );
};
export default FileUploader;