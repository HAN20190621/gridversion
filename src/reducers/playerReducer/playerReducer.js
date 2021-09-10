// game reducer
// score is incrementing by 2 instead of 1
//The reason that your quantity is being incremented twice is
//because you would be using React.StrictMode which
//invokes your reducer twice which
//cause the count to increment twice
export default function gameReducer(state, action) {
  //console.log(action.type);
  let xo,
    players,
    tempIdx,
    winners,
    currentPlayer,
    firstPlayer,
    newState,
    score;
  switch (action.type) {
    case "update current player": {
      xo = action.payload.xo;
      players = state.players;
      tempIdx = ((xo) => players.findIndex((player) => player.xo === xo))(xo);
      return {
        ...state,
        currentPlayer: players[tempIdx]
      };
    }
    case "request to start": {
      players = state.players;
      tempIdx = Math.floor(Math.random() * 2);
      const first = players[tempIdx].xo;
      return {
        ...state,
        firstPlayer: first,
        currentPlayer: players[tempIdx],
        winners: {
          xo: "",
          winners: [],
          score: 0
        }
      };
    }
    case "update winners": {
      xo = action.payload.xo;
      winners = action.payload.winners;
      currentPlayer = state.currentPlayer;
      firstPlayer = state.firstPlayer;
      score = state.winners.score + 1;
      players = [...state.players];
      tempIdx = ((xo) => players.findIndex((player) => player.xo === xo))(xo);
      newState = {
        players: [
          ...state.players.slice(0, tempIdx),
          {
            ...state.players[tempIdx],
            score: state.players[tempIdx].score + 1
          },
          ...state.players.slice(tempIdx + 1)
        ],
        winners: {
          xo: xo,
          winners: winners,
          score: score
        },
        currentPlayer: currentPlayer,
        firstPlayer: firstPlayer
      };
      return newState;
    }
    case "reset winners": {
      const { jumpToInd } = action.payload;
      winners = state.winners; //({ winners }) = state;
      currentPlayer = state.currentPlayer;
      firstPlayer = state.firstPlayer;
      score = winners.score + (jumpToInd ? -1 : 1);
      if (winners.score > 0) {
        players = [...state.players];
        tempIdx = ((xo) => players.findIndex((player) => player.xo === xo))(
          winners.xo
        );
        newState = {
          players: [
            ...state.players.slice(0, tempIdx),
            {
              ...state.players[tempIdx],
              score: state.players[tempIdx].score + (jumpToInd ? -1 : 1)
            },
            ...state.players.slice(tempIdx + 1)
          ],
          winners: {
            xo: "",
            winners: [],
            score: score
          },
          currentPlayer: currentPlayer,
          firstPlayer: firstPlayer
        };
        return newState;
      } else {
        return { ...state };
      }
    }
    default:
      throw new Error(); //do nothing;
  }
}
