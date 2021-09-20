import { useState, useEffect, useCallback } from "react";

const Grid = ({ grid, setPositions, colour, winners, onClick, selIndex }) => {
  let end = grid.length - 1;

  // function getWinners() {
  //   switch (winners.type) {
  //     case "H":
  //       break;
  //     case "V":
  //       break;
  //     case "D1":
  //       // code block
  //       break;
  //     case "D2":
  //       break;
  //     default:
  //     // code block
  //   }
  // }

  return (
    <div style={{ display: "inline-block" }}>
      <div
        style={{
          background: "#000",
          display: "grid",
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0].length},1fr)`,
          gridGap: 10
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <Cell
              key={`${colIdx}-${rowIdx}`}
              cell={cell}
              colour={colour}
              range={{
                x: colIdx,
                y: rowIdx,
                index: rowIdx + colIdx + rowIdx * end
              }}
              onClick={onClick}
              selIndex={selIndex}
              winners={winners}
              setPositions={setPositions}
            />
          ))
        )}
      </div>
    </div>
  );
};

const cellStyle = {
  background: "#fff",
  height: 75,
  width: 75
};

function Cell({
  cell,
  colour,
  range,
  onClick,
  selIndex,
  winners,
  setPositions
}) {
  const [colour_, setColour_] = useState("black");
  //console.log("dooo=", selIndex, range.index, colour);
  const style = {
    color: colour_,
    fontWeight: "bold",
    height: "inherit",
    width: "inherit"
  };

  // change the colour of the clicked/selected Index
  // save selected index
  // on click - call useEffect to re-render with the selected colour
  useEffect(() => {
    //console.log(selIndex, range.index);
    setColour_(selIndex === range.index ? colour : "black");
  }, [selIndex, range.index, colour, setColour_]);

  useEffect(() => {
    // set winners to selected colour
    if (winners.length > 0) {
      const item = `${range.y}${range.x}`;
      setColour_(winners.includes(item) ? colour : "black");
    }
  }, [winners, range.y, range.x, colour]);

  const itemRef = useCallback(
    (ref) => {
      if (ref) {
        let item = ref?.getBoundingClientRect().toJSON();
        //console.log(idx);
        setPositions((prev) => {
          if (Object.keys(prev)["item" + range.index] === undefined) {
            return {
              ...prev,
              ["item" + range.index]: item
            };
          }
        });
      }
    },
    [setPositions, range.index]
  );

  return (
    <div style={cellStyle}>
      <button
        ref={itemRef}
        type="button"
        style={style}
        onClick={() => {
          //(colIdx+rowIdx) + rowIdx*MAX(coldIdx)
          //console.log(range.x + " " + range.y + " " + idx + " " + range.end);
          onClick(range.x, range.y, range.index);
        }}
      >
        {cell}
      </button>
    </div>
  );
}

// function generateGrid(rows, columns, mapper) {
//   let arr = Array(rows)
//     .fill()
//     .map(() => Array(columns).fill().map(mapper));
//   console.log(arr.length);
//   return arr;
// }

// Grid.defaultProps = {
//   grid: generateGrid(3, 3, () => null),
//   currPlayer: { colour: "pink" }
// };

export default Grid;
