import React, { useState, useEffect, useCallback } from 'react';
import Colours from './Colours';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

export default function EditPlayer({ player, showModal, onChange, coords }) {
  const [item, setItem] = useState({ rank: 0, name: '', colour: '' });
  const [show, setShow] = useState(true);
  const [init, setInit] = useState(false);

  // initialise
  useEffect(() => {
    if (player === null || player === undefined) {
      setItem({ rank: 0, name: '', colour: '' });
    } else setItem(player);
    setInit(true);
  }, [init, player]);

  // update player details
  function handleOnChange(event) {
    const { value } = event.target;
    const newItem = { ...item, name: value, isDirty: true };
    setItem(newItem);
    // send change to parent
    if (onChange === undefined) return;
    onChange(newItem);
  }

  function handleSetColour(newColour) {
    if (newColour === '') return;
    // update player details
    const newItem = { ...item, colour: newColour, isDirty: true };
    setItem(newItem);
    // send change to parent
    if (onChange === undefined) return;
    onChange(newItem);
  }

  function handleCloseForm(event) {
    event.preventDefault();
    setShow(false);
    showModal(false, item, null);
  }

  const handleEscape = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        setShow(false);
        showModal(false, item, null);
      }
    },
    [item, showModal]
  );

  useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleEscape, false);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape, false);
    };
  }, [handleEscape, show]);

  return (
    <div style={{ ...styles.modal, ...coords }}>
      <form className="add-form">
        <div className="form-control">
          <FaTimes
            id="close"
            style={{
              marginRight: '20px',
              marginTop: '20px',
              color: 'white',
              border: 'none',
              backgroundColor: '#c53257',
              borderRadius: '100%',
              width: '20px',
              height: '20px',
              cursor: 'pointer',
            }}
            onClick={handleCloseForm}
          />
          <div>
            <label>Name</label>
            <input
              name="name"
              type="text"
              key={item.rank}
              id={item.rank}
              placeholder="enter player name here"
              value={item.name}
              onChange={handleOnChange}
            />
          </div>
          <div>
            <Colours selectedColour={item.colour} setColour={handleSetColour} />
          </div>
        </div>
      </form>
    </div>
  );
}

EditPlayer.propTypes = {
  player: PropTypes.object,
  showModal: PropTypes.func,
  onChange: PropTypes.func,
  coords: PropTypes.object,
};

const styles = {
  modal: {
    position: 'fixed',
    zIndex: 1000,
  },
  //width: 200,
  // transform: "translate(-100px, -100%)"
};

// const styles = {
//   editPlayerContainer: {
//     alignItems: 'center',
//     border: '1px solid steelblue',
//     borderRadius: '5px',
//     display: 'inline-flex',
//     flexDirection: 'row',
//     fontSize: '60px',
//     justifyContent: 'space-between',
//     padding: '30px',
//     position: 'absolute',
//     margin: '180px 200px',
//     maxWidth: '300px',
//     minHeight: '100px',
//   },
//   formControl: {
//     container: { margin: '20px 0' },
//     label: {
//       display: 'block',
//     },
//     input: {
//       width: '100%',
//       height: '40px',
//       margin: '5px',
//       padding: '3px 7px',
//       fontSize: '17px',
//     },
//   },
// };
