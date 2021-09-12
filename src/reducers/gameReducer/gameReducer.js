import { NEXT_TURN } from "../gameReducer/constants";

// Simple way to deeply clone an array or object
const clone = (x) => JSON.parse(JSON.stringify(x));

// const initialState = {
//   grid: newTicTacToeGrid(),
//   turn: "X"
// };

// Depending on your JavaScript environment, you can potentially
// use Array.prototype.flat to do this
const flatten = (array) => array.reduce((acc, cur) => [...acc, ...cur], []);

const checkThree = (a, b, c) => {
  // If any of the values are null, return false
  if (!a || !b || !c) return false;
  return a === b && b === c;
};

function checkForWin(flatGrid) {
  // Because our grid is flat, we can use array destructuring to
  // define variables for each square, I will use the points on a
  // compass as my variable names
  const [nw, n, ne, w, c, e, sw, s, se] = flatGrid;

  // Then we simply run `checkThree` on each row, column and diagonal
  // If it's true for any of them, the game has been won!
  return (
    checkThree(nw, n, ne) ||
    checkThree(w, c, e) ||
    checkThree(sw, s, se) ||
    checkThree(nw, w, sw) ||
    checkThree(n, c, s) ||
    checkThree(ne, e, se) ||
    checkThree(nw, c, se) ||
    checkThree(ne, c, sw)
  );
}

// function checkForDraw(flatGrid) {
//   return (
//     !checkForWin(flatGrid) &&
//     flatGrid.filter(Boolean).length === flatGrid.length
//   );
// }

// game reducer
// score is incrementing by 2 instead of 1
//The reason that your quantity is being incremented twice is
//because you would be using React.StrictMode which
//invokes your reducer twice which
//cause the count to increment twice
export default function gameReducer(state, action) {
  //console.log(action.type);
  //let xo, players, tempIdx, winners, player, turn, newState, score;
  switch (action.type) {
    case "click": {
      const { x, y, index } = action.payload;

      // Since we need immutable updates, I often find the simplest thing to do
      // is to clone the current state, and then use mutations on the clone to
      // make updates for the next state
      const nextState = clone(state);

      const { history, turn, players, winners } = nextState;
      const { grid } = history[history.length - 1]; // advance

      //console.log(winners);

      // If the cell already has a value, clicking on it should do nothing
      // Also, pay attention, because our rows are first, the `y` value is the
      // first index, the `x` value second. This takes some getting used to.
      if (grid[y][x]) {
        return state;
      }

      // If we're here in our program, we can assign this cell to the current
      // `turn` value
      grid[y][x] = turn;

      const tempIdx = ((xo) => players.findIndex((player) => player.xo === xo))(
        NEXT_TURN[turn]
      );

      const player = players[tempIdx];
      nextState.player = player;
      // take a copy of the previous history and append the new one
      const newHistory = [
        ...state.history,
        {
          x: x,
          y: y,
          index: index,
          grid: grid,
          turn: turn,
          player: player,
          winners: winners
        }
      ];
      nextState.history = newHistory;

      const flatGrid = flatten(grid);

      if (checkForWin(flatGrid)) {
        nextState.status = "success";
        return nextState;
      }

      // if (checkForDraw(flatGrid)) {
      //   return getInitialState();
      // }

      // Now that we've used this turn, we need to set the next turn. It might
      // be overkill, but I've used an object enum to do this.
      nextState.turn = NEXT_TURN[turn];

      // We'll add checks for winning or drawing soon

      return nextState;
    }

    case "move to": {
      // get the previous step
      const { moveIndex } = action.payload;
      // go back a step
      const nextState = clone(state);
      const { history } = nextState;
      // get history
      const newHistory =
        moveIndex === 0 ? history.slice(0, 1) : history.slice(0, moveIndex + 1);
      const { turn, player, winners } = newHistory[newHistory.length - 1];
      // set new object
      nextState.turn = turn;
      nextState.player = player;
      nextState.winners = winners;
      nextState.history = newHistory;
      return nextState;
    }

    // case "request to start": {
    //   players = state.players;
    //   tempIdx = Math.floor(Math.random() * 2);
    //   const first = players[tempIdx].xo;
    //   return {
    //     ...state,
    //     firstPlayer: first,
    //     currentPlayer: players[tempIdx],
    //     winners: {
    //       xo: "",
    //       winners: [],
    //       score: 0
    //     }
    //   };
    // }

    // case "update winners": {
    //   xo = action.payload.xo;
    //   winners = action.payload.winners;
    //   currentPlayer = state.currentPlayer;
    //   firstPlayer = state.firstPlayer;
    //   score = state.winners.score + 1;
    //   players = [...state.players];
    //   tempIdx = ((xo) => players.findIndex((player) => player.xo === xo))(xo);
    //   newState = {
    //     players: [
    //       ...state.players.slice(0, tempIdx),
    //       {
    //         ...state.players[tempIdx],
    //         score: state.players[tempIdx].score + 1
    //       },
    //       ...state.players.slice(tempIdx + 1)
    //     ],
    //     winners: {
    //       xo: xo,
    //       winners: winners,
    //       score: score
    //     },
    //     currentPlayer: currentPlayer,
    //     firstPlayer: firstPlayer
    //   };
    //   return newState;
    // }

    // case "reset winners": {
    //   const { jumpToInd } = action.payload;
    //   winners = state.winners; //({ winners }) = state;
    //   currentPlayer = state.currentPlayer;
    //   firstPlayer = state.firstPlayer;
    //   score = winners.score + (jumpToInd ? -1 : 1);
    //   if (winners.score > 0) {
    //     players = [...state.players];
    //     tempIdx = ((xo) => players.findIndex((player) => player.xo === xo))(
    //       winners.xo
    //     );
    //     newState = {
    //       players: [
    //         ...state.players.slice(0, tempIdx),
    //         {
    //           ...state.players[tempIdx],
    //           score: state.players[tempIdx].score + (jumpToInd ? -1 : 1)
    //         },
    //         ...state.players.slice(tempIdx + 1)
    //       ],
    //       winners: {
    //         xo: "",
    //         winners: [],
    //         score: score
    //       },
    //       currentPlayer: currentPlayer,
    //       firstPlayer: firstPlayer
    //     };
    //     return newState;
    //   } else {
    //     return { ...state };
    //   }
    // }
    default:
    //   throw new Error(); //do nothing;
  }
}
