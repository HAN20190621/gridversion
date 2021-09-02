const Grid = ({ grid }) => {
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
            <Cell key={`${colIdx}-${rowIdx}`} cell={cell} />
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

function Cell({ cell }) {
  return (
    <div style={cellStyle}>
      <button
        type="button"
        style={{ height: "inherit", width: "inherit" }}
        onClick={() => {}}
      >
        {cell}
      </button>
    </div>
  );
}

function generateGrid(rows, columns, mapper) {
  return Array(rows)
    .fill()
    .map(() => Array(columns).fill().map(mapper));
}

Grid.defaultProps = {
  grid: generateGrid(3, 3, () => null)
};

export default Grid;
