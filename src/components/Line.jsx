import React, { useReducer, useEffect, useCallback } from "react";
import lineReducer from "../reducers/lineReducer/lineReducer";
import PropTypes from "prop-types";
const NONE = {};
const initialiseState = { style: NONE };

// this component draws a line on the winner (squares)
export default function Line({ winners, positions, grid }) {
  const [line, dispatch] = useReducer(lineReducer, initialiseState);

  //console.log("positions=", positions);
  // const x = ["00", "01", "02", "01"];
  // console.log(x.sort()[0]); // 1

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
      <button
        onClick={() => {
          dispatch({
            type: "recalculate style",
            payload: {
              winners: winners,
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
  winners: ["00", "11", "22", "33"]
};
