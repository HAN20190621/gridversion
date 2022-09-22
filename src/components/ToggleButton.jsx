import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Button = styled.button`
  background-color: black;
  color: ${(props) => (props.sortAsc ? 'white' : 'grey')};
  opacity: ${(props) => (props.sortAsc ? 1 : 0.7)};
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
  // &:hover {
  //   background-color: lightblue;
  // }
`;

function ToggleButton(props) {
  const [sortAsc, setSortAsc] = useState(true);

  function toggleButton() {
    props.toggle(!sortAsc);
    setSortAsc(!sortAsc);
  }

  return (
    <div className='button-toggle'>
      <Button sortAsc={sortAsc} onClick={() => toggleButton()}>
        {sortAsc ? 'DESC' : 'ASC'}
      </Button>
    </div>
  );
}

ToggleButton.propTypes = {
  toggle: PropTypes.func,
};

export default ToggleButton;

// https://www.youtube.com/watch?v=17AwVXg5lHk
//https://github.com/styled-components/styled-components/issues/3117
