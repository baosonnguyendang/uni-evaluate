import React,{ useState } from 'react';
import { Button, Typography } from '@material-ui/core'

const FileUploader = props => {
  const hiddenFileInput = React.useRef(null);
  const [file, setFile] = React.useState(null)
  const [error, setError] = useState(null)

  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file) {
      setError("Vui lòng chọn file excel")
      return
    }
    props.submit(file)
    setError(null)
    setFile(null)
  }
  const handleChange = event => {
    setFile(event.target.files[0])
  };
  return (
    <>
      <Typography variant='h5' gutterBottom >{props.title}</Typography>
      <form onSubmit={handleSubmit} >
        <Button onClick={handleClick} variant="contained" size="small">
          Chọn file excel
        </Button>
        <br />
        <br />
        <input type="file"
          ref={hiddenFileInput}
          onChange={handleChange}
          style={{ display: 'none' }}
          name='file'
        />
        <div style={{ height: '150px' }}>
          {error && <Typography color='secondary'>{error}</Typography>}
          <Typography>{file?.name}</Typography>
        </div>
        <br />
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Button style={{ marginRight: '10px' }} type="submit" variant="contained" color="primary"  >Nhập dữ liệu</Button>
          <Button style={{ marginLeft: '10px' }} variant="contained" onClick={props.handleClose}>Thoát</Button>
        </div>
      </form>
    </>
  );
};
export default FileUploader;