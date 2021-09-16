const Grid = ({ grid, setCellStyle, setPositions, onClick }) => {
  let end = grid.length - 1;
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
              setCellStyle={setCellStyle}
              range={{ x: colIdx, y: rowIdx, end: end }}
              onClick={onClick}
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

function Cell({ cell, setCellStyle, range, onClick }) {
  let idx = range.y + range.x + range.y * range.end;

  function setCellStyle_(range) {
    //console.log(range.x + " " + range.y + " " + idx);
    let style = setCellStyle(idx);
    //console.log(style);
    return { ...style, height: "inherit", width: "inherit" };
  }

  return (
    <div style={cellStyle}>
      <button
        type="button"
        style={setCellStyle_(range)}
        onClick={() => {
          //(colIdx+rowIdx) + rowIdx*MAX(coldIdx)
          console.log(range.x + " " + range.y + " " + idx + " " + range.end);
          onClick(range.x, range.y, idx);
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
