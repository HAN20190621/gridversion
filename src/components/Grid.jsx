import { useState, useEffect, useCallback } from 'react';

const Grid = ({
  grid,
  setPositions,
  colour,
  winners,
  onClick,
  selIndex,
  jumpToInd,
}) => {
  let end = grid.length - 1;

  return (
    <div style={{ display: 'inline-block' }}>
      <div
        style={{
          // background: "#000",
          //background: "red",
          display: 'grid',
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0].length},1fr)`,
          gridGap: 10,
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
                index: rowIdx + colIdx + rowIdx * end,
              }}
              onClick={onClick}
              selIndex={selIndex}
              winners={winners}
              setPositions={setPositions}
              jumpToInd={jumpToInd}
            />
          ))
        )}
      </div>
    </div>
  );
};

const cellStyle = {
  background: '#fff',
  height: 75,
  width: 75,
};

function Cell({
  cell,
  colour,
  range,
  onClick,
  selIndex,
  winners,
  setPositions,
  jumpToInd,
}) {
  const [colour_, setColour_] = useState('black');
  //console.log("test=", selIndex, range.index, colour);
  const style = {
    color: colour_,
    fontWeight: 'bold',
    height: 'inherit',
    width: 'inherit',
  };

  // change the colour of the clicked/selected Index
  // save selected index
  // on click - call useEffect to re-render with the selected colour
  useEffect(() => {
    //console.log(selIndex, range.index);
    setColour_(selIndex === range.index ? colour : 'black');
  }, [selIndex, range.index, colour]);

  useEffect(() => {
    // set winners to selected colour
    if (winners.length > 0) {
      const item = `${range.y}${range.x}`;
      setColour_(winners.includes(item) ? colour : 'black');
    }
  }, [winners, range.y, range.x, colour]);

  useEffect(() => {
    if (winners.length > 0) return;
    if (jumpToInd) setColour_('black');
  }, [winners, jumpToInd]);

  const itemRef = useCallback(
    (ref) => {
      if (ref) {
        let item = ref?.getBoundingClientRect().toJSON();
        //console.log(idx);
        setPositions((prev) => {
          if (Object.keys(prev)['item' + range.index] === undefined) {
            return {
              ...prev,
              ['item' + range.index]: item,
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
        type='button'
        style={{
          ...style,
          fontSize: '30px',
          backgroundColor: 'lightgreen',
        }}
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

function generateGrid(rows, columns, mapper) {
  let arr = Array(rows)
    .fill()
    .map(() => Array(columns).fill().map(mapper));
  console.log(arr.length);
  return arr;
}

Grid.defaultProps = {
  grid: generateGrid(3, 3, () => null),
  setPositions: () => {},
  colour: 'green',
  winners: [],
  onClick: () => {},
  selIndex: 1,
  jumpToInd: false,
};

Cell.defaultProps = {
  cell: generateGrid(3, 3, () => {
    return null;
  })[0][0],
  colour: 'green',
  range: {
    x: 0,
    y: 0,
    index: 0,
  },
  onClick: () => {},
  selIndex: 0,
  winners: [],
  setPositions: () => {},
  jumpToInd: false,
};

export default Grid;
