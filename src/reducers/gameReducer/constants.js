// An enum for the next turn in our game
export const NEXT_TURN = {
  O: "X",
  X: "O"
};

// who starts first
// 1 - X  2 - O
const getNextTurn = () => {
  const idx = Math.floor(Math.random() * 2);
  const keys = Object.keys(NEXT_TURN);
  return NEXT_TURN[keys[idx]]; //["X", "O"][idx];
};

const initialiseWinners = () => {
  //return { xo: "", winners: [], score: 0 };
  return [];
};

const initialiseMoves = (moveTo) => {
  const desc = "Go to game start";
  return (
    <li key={0}>
      <button
        onClick={() => {
          moveTo(0);
        }}
      >
        {desc}
      </button>
    </li>
  );
};

function generateGrid(rows, columns, mapper) {
  let arr = Array(rows)
    .fill()
    .map(() => Array(columns).fill().map(mapper));
  return arr;
}

const newTicTacToeGrid = generateGrid(3, 3, () => {
  return null;
});

export const initialiseGame = (players, moveTo) => {
  const turn = getNextTurn();
  const tempIdx = ((xo) => players.findIndex((player) => player.xo === xo))(
    turn
  );
  const currentPlayer = players[tempIdx];
  const winners = initialiseWinners();
  const moves = [initialiseMoves(moveTo)];
  let history = [
    {
      x: -1,
      y: -1,
      index: -1,
      grid: newTicTacToeGrid,
      turn: turn,
      player: currentPlayer,
      winners: winners // winning marks
    }
  ];

  return {
    history: history,
    players: players,
    turn: turn,
    player: currentPlayer,
    winners: winners,
    selIndex: -1,
    moves: moves
  };
};
