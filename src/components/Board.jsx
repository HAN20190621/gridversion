import React, { useState } from "react";
import PropTypes from "prop-types";
import Grid from "./Grid";
import Line from "./Line";

// Simple way to deeply clone an array or object
const clone = (x) => JSON.parse(JSON.stringify(x));

// An enum for the next turn in our game
const NEXT_TURN = {
  O: "X",
  X: "O"
};

const initialState = {
  grid: newTicTacToeGrid(),
  turn: "X"
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CLICK": {
      const { x, y } = action.payload;
      // Since we need immutable updates, I often find the simplest thing to do
      // is to clone the current state, and then use mutations on the clone to
      // make updates for the next state
      const nextState = clone(state);
      const { grid, turn } = nextState;

      // If the cell already has a value, clicking on it should do nothing
      // Also, pay attention, because our rows are first, the `y` value is the
      // first index, the `x` value second. This takes some getting used to.
      if (grid[y][x]) {
        return state;
      }

      // If we're here in our program, we can assign this cell to the current
      // `turn` value
      grid[y][x] = turn;

      // Now that we've used this turn, we need to set the next turn. It might
      // be overkill, but I've used an object enum to do this.
      nextState.turn = NEXT_TURN[turn];

      // We'll add checks for winning or drawing soon

      return nextState;
    }

    default:
      return state;
  }
};

//  https://www.pluralsight.com/guides/applying-classes-conditionally-react
const Board = ({
  squares,
  winners, // winners
  selItems, // list of selected items
  stepNumber, // current step
  currentPlayer, // current player
  onClick // function on click
}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { grid } = state;

  const handleClick = (x, y) => {
    dispatch({ type: "CLICK", payload: { x, y } });
  };

  const [positions, setPositions] = useState({});

  const currentPlayerStyle = {
    color: currentPlayer.colour,
    fontWeight: "bold"
  };
  const normalStyle = {
    color: "black",
    fontWeight: "normal"
  };

  function setCellStyle(index) {
    return winners.includes(index) || selItems[stepNumber - 1] === index
      ? currentPlayerStyle
      : normalStyle;
  }

  return (
    <>
      <div>
        <Grid
          grid={squares}
          setCellStyle={setCellStyle}
          setPositions={setPositions}
          onClick={(x, y, idx) => {
            console.log(x, y, idx);
          }}
        />
      </div>
      {positions && winners && (
        <Line winners={winners} positions={positions}></Line>
      )}
    </>
  );
};

Board.propTypes = {
  squares: PropTypes.array,
  winners: PropTypes.array,
  selItems: PropTypes.array,
  stepNumber: PropTypes.number,
  currentPlayer: PropTypes.object,
  onClick: PropTypes.func
};

// function generateGrid(rows, columns, mapper) {
//   let arr = Array(rows)
//     .fill()
//     .map(() => Array(columns).fill().map(mapper));
//   return arr;
// }

function generateGrid(rows, columns, mapper) {
  let arr = Array(rows)
    .fill()
    .map(() => Array(columns).fill().map(mapper));
  //arr[1][0] = "X";
  //arr[1][1] = "X";
  //arr[1][2] = "X";
  return arr;
}

Board.defaultProps = {
  squares: generateGrid(3, 3, () => null),
  winners: [3, 4, 5],
  selItems: [0, 1, 2],
  stepNumber: 1,
  currentPlayer: { colour: "red" },
  onClick: () => {}
};

export default Board;
