import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{position: 'absolute',
    top: '50%',
    right: '50%',
    transform: 'translate(50%, -50%)',
    textAlign: 'center'
    }}>
    <img
      src="https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png"
      alt="not-found"
    />
    <br/>
    <Link to="/" className="link-home">
      Trở lại trang chủ
    </Link>
  </div>
)

export default NotFound;