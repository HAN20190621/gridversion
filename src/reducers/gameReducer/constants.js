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
  return { xo: "", winners: [], score: 0 };
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

export const initialiseGame = (players) => {
  const turn = getNextTurn();
  const tempIdx = ((xo) => players.findIndex((player) => player.xo === xo))(
    turn
  );
  const currentPlayer = players[tempIdx];
  //const winners = initialiseWinners();
  let history = [
    {
      x: -1,
      y: -1,
      index: -1,
      grid: newTicTacToeGrid,
      turn: turn,
      player: currentPlayer
      //winners: winners // winning marks
    }
  ];

  return {
    history: history,
    players: players,
    turn: turn,
    player: currentPlayer
    //winners: winners
  };
};
