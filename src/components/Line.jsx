import React, { useReducer, useEffect, useCallback } from 'react';
import lineReducer from '../reducers/lineReducer/lineReducer';
import PropTypes from 'prop-types';
const NONE = {};
const initialiseState = { style: NONE };

// this component draws a line on the winner (squares)
export default function Line({ winners, positions, grid }) {
  const [line, dispatch] = useReducer(lineReducer, initialiseState);

  //console.log(positions);

  const setLine = useCallback(() => {
    dispatch({
      type: 'recalculate style',
      payload: { winners: winners, rect: positions, grid: grid },
    });
  }, [winners, positions, grid]);

  useEffect(() => {
    setLine();
  }, [setLine]);

  return (
    <>
      <div style={line.style}></div>
    </>
  );
}

Line.propTypes = {
  winners: PropTypes.array,
  positions: PropTypes.object,
  grid: PropTypes.array,
};

function generateGrid(rows, columns, mapper) {
  let arr = Array(rows)
    .fill()
    .map(() => Array(columns).fill().map(mapper));
  return arr;
}

function getPositions() {
  let positions = {
    item0: {
      bottom: 317.6666717529297,
      height: 75,
      left: 70.66667175292969,
      right: 145.6666717529297,
      top: 242.6666717529297,
      width: 75,
      x: 70.66667175292969,
      y: 242.6666717529297,
    },
  };
  positions['item1'] = {
    bottom: 317.6666717529297,
    height: 75,
    left: 155.6666717529297,
    right: 230.6666717529297,
    top: 242.6666717529297,
    width: 75,
    x: 155.6666717529297,
    y: 242.6666717529297,
  };
  positions['item2'] = {
    bottom: 317.6666717529297,
    height: 75,
    left: 240.6666717529297,
    right: 315.6666717529297,
    top: 242.6666717529297,
    width: 75,
    x: 240.6666717529297,
    y: 242.6666717529297,
  };
  //console.log(positions.length);
  return positions;
}

Line.defaultProps = {
  winners: ['00', '01', '02'],
  positions: getPositions(),
  grid: generateGrid(3, 3, () => {
    return null;
  }),
  // winners: ["00", "01", "02", "03"] // horizontal
  // winners: ["10", "11", "12", "13"] // vertical
  //winners: ['00', '11', '22', '33'], // diagonal
};
