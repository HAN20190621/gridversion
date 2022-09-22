import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ location }) => {
  return (
    <>
      {location.pathname === '/' && (
        <footer style={{ textAlign: 'center' }}>
          <p>Copyright &copy; {new Date().getFullYear()}</p>
          <Link to='/About'>About</Link>
        </footer>
      )}
    </>
  );
};

Footer.defaultProps = {
  location: { pathname: '/' },
};

export default Footer;
