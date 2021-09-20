import React, { useState } from "react";
import PropTypes from "prop-types";
import Grid from "./Grid";
import Line from "./Line";

//  https://www.pluralsight.com/guides/applying-classes-conditionally-react
const Board = ({
  grid,
  winners, // winners
  // selItems, // list of selected items
  // stepNumber, // current step
  player, // current player
  handleClick,
  selIndex // function on click
}) => {
  const [positions, setPositions] = useState({});

  // const playerStyle = {
  //   color: player.colour,
  //   fontWeight: "bold"
  // };

  // const normalStyle = {
  //   color: "black",
  //   fontWeight: "normal"
  // };

  // function setCellStyle() {
  //   return winners.index === -1 ? normalStyle : playerStyle;
  //   //return playerStyle;
  // }

  return (
    <>
      <div>
        <Grid
          grid={grid}
          // setCellStyle={setCellStyle}
          setPositions={setPositions}
          colour={player.colour}
          winners={winners}
          onClick={(x, y, idx) => {
            handleClick(x, y, idx);
          }}
          selIndex={selIndex}
        />
      </div>
      {positions && winners && (
        <Line winners={winners} positions={positions}></Line>
      )}
    </>
  );
};

Board.propTypes = {
  grid: PropTypes.array,
  winners: PropTypes.array,
  // selItems: PropTypes.array,
  // stepNumber: PropTypes.number,
  player: PropTypes.object,
  handleClick: PropTypes.func,
  selIndex: PropTypes.number
};

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
  grid: generateGrid(3, 3, () => null),
  winners: [],
  selItems: [0, 1, 2],
  stepNumber: 1,
  player: { colour: "red" },
  handleClick: (x, y, idx) => {
    //console.log(x, y, idx);
  }
};

export default Board;
