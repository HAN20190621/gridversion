import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import '../src/styles.css';

// You can import global CSS files here.

// No-op wrapper.
export const Wrapper: React.FC = ({ children }) => {
  return (
    <>
      <Router>{children}</Router>
    </>
  );
};
