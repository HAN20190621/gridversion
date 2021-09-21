import React, { useReducer, useEffect, useCallback } from "react";
import lineReducer from "../reducers/lineReducer/lineReducer";
import PropTypes from "prop-types";
const NONE = {};
const initialiseState = { style: NONE };

// this component draws a line on the winner (squares)
export default function Line({ winners, positions, grid }) {
  const [line, dispatch] = useReducer(lineReducer, initialiseState);

  const setLine = useCallback(() => {
    dispatch({
      type: "recalculate style",
      payload: { winners: winners, rect: positions, grid: grid }
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
  grid: PropTypes.array
};

Line.defaultProps = {
  positions: {
    item0: {
      width: 100,
      height: 5,
      top: 100,
      left: 5
    }
  },
  colour: "red",
  // winners: ["00", "01", "02", "03"] // horizontal
  // winners: ["10", "11", "12", "13"] // vertical
  winners: ["00", "11", "22", "33"] // diagonal
};
