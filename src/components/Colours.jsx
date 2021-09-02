// https://dev.to/ramonak/react-how-to-create-a-custom-button-group-component-in-5-minutes-3lfd
import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';

function Colours({ colours, selectedColour, setColour }) {
  // return selected colour to parent
  function handleOnClick(event) {
    if (setColour === undefined) return;
    event.preventDefault();
    const { style } = event.target;
    setColour(style.backgroundColor);
  }

  // function applyStyle(colour) {
  //   return { backgroundColor: colour };
  // }

  return (
    <>
      {colours.map((item, index) => (
        <Button
          className={selectedColour === item ? 'btn btn-selected' : 'btn'}
          key={index}
          text={item}
          id={index}
          onClick={handleOnClick}
          colour={item}
        />
      ))}
    </>
  );
}

Colours.propTypes = {
  colours: PropTypes.array,
  selectedColour: PropTypes.string,
  setColour: PropTypes.func,
};
Colours.defaultProps = {
  colours: ['pink', 'yellow', 'green'],
};

export default Colours;
