import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ text, colour, onClick, className }) => {
  return (
    <>
      <button
        className={className}
        style={{ backgroundColor: colour }}
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  colour: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Button.defaultProps = {
  text: '',
  color: 'green',
  onClick: () => {},
  className: 'btn',
};

export default Button;
