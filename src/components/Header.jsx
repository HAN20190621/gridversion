import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from './Button';

// import { preview } from '@reactpreview/config';

const Header = ({ title, resizing }) => {
  const location = useLocation();
  const h1Ref = useRef(null);
  const divRef = useRef(null);
  const [style, setStyle] = useState({ marginLeft: '50px' });

  console.log(location.pathname);

  useEffect(() => {
    let rect1 = h1Ref.current.getBoundingClientRect();
    let rect2 = divRef.current.getBoundingClientRect();
    setStyle({
      marginLeft:
        Math.round(rect1.bottom) === Math.round(rect2.top) ? '0px' : '50px',
    });
  }, [resizing]);

  return (
    <div className='header'>
      <h1 ref={h1Ref}>{title}</h1>
      <div ref={divRef} style={style}>
        {(location.pathname === '/' || location.pathname === '/Players') && (
          <Link to='/Game'>
            <Button text='Start' colour='green' />
          </Link>
        )}
        {location.pathname === '/' && (
          <Link to='/Players'>
            <Button text='Players' colour='blue' />
          </Link>
        )}
      </div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  resizing: PropTypes.bool,
};

Header.defaultProps = {
  title: 'tic-tac-toe',
  resizing: false,
  location: { pathname: '/' },
};

// preview(Header, {
//   example: {
//     title: 'tic-tac-toe',
//     location: {
//       pathname: '/',
//     },
//   },
// });

export default Header;
