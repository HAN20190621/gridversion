const Grid = ({
  grid,
  winners,
  selItems,
  stepNumber,
  currPlayer,
  jumpToInd,
  onClick
}) => {
  let size = grid.length - 1;
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
              range={{ x: colIdx, y: rowIdx, size: size }}
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

function Cell({ cell, range }) {
  return (
    <div style={cellStyle}>
      <button
        type="button"
        style={{ height: "inherit", width: "inherit", backgroundColor: "pink" }}
        onClick={() => {
          //(colIdx+rowIdx) + rowIdx*MAX(coldIdx)
          let idx = range.y + range.x + range.y * range.size;
          console.log(range.x + " " + range.y + " " + idx);
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
  grid: generateGrid(4, 4, () => null),
  currPlayer: { colour: "pink" }
};

export default Grid;
