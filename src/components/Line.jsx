import React, { useReducer, useEffect, useCallback } from "react";
import lineReducer from "../reducers/lineReducer/lineReducer";
import PropTypes from "prop-types";
const NONE = {};
const initialiseState = { style: NONE };

// this component draws a line on the winner (squares)
export default function Line({ winners, positions }) {
  const [line, dispatch] = useReducer(lineReducer, initialiseState);

  const setLine = useCallback(() => {
    dispatch({
      type: "recalculate style",
      payload: { winners: winners, rect: positions }
    });
  }, [winners, positions]);

  useEffect(() => {
    setLine();
  }, [setLine]);

  return (
    <>
      <button
        onClick={() => {
          dispatch({
            type: "recalculate style",
            payload: {
              winners: [2, 4, 6],
              rect: {
                item6: {
                  width: 100,
                  height: 5,
                  top: 100,
                  left: 5
                }
              }
            }
          });
        }}
      >
        Click me
      </button>
      <div style={line.style}></div>
    </>
  );
}

Line.propTypes = {
  winners: PropTypes.array,
  positions: PropTypes.object
  //colour: PropTypes.string,
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
  winners: [8, 4, 0]
};
