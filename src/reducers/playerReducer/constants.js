// who starts first
// 1 - X  2 - O
const initialiseFirstPlayer = () => {
  const idx = Math.floor(Math.random() * 2);
  return ["X", "O"][idx];
};

const initialiseWinners = () => {
  return { xo: "", winners: [], score: 0 };
};

export const initialiseGame = (players) => {
  const firstPlayer = initialiseFirstPlayer();
  const tempIdx = ((xo) => players.findIndex((player) => player.xo === xo))(
    firstPlayer
  );
  const currentPlayer = players[tempIdx];
  return {
    players: players,
    currentPlayer: currentPlayer,
    firstPlayer: firstPlayer,
    winners: initialiseWinners()
  };
};
