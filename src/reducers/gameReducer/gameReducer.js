import { NEXT_TURN } from "../gameReducer/constants";

// Simple way to deeply clone an array or object
const clone = (x) => JSON.parse(JSON.stringify(x));

// function generateGrid(rows, columns, mapper) {
//   return Array(rows).fill().map(() => {
//       return Array(columns).fill().map(mapper);
//   })
// }

// const grid = (() => generateGrid(4, 4, () => null))();

// /* grid[0][0] = 'X'
// grid[0][1] = 'X'
// grid[0][2] = 'X'
// grid[0][3] = 'X'
// */

// grid[0][2] ='X';
// grid[1][2] ='X';
// grid[2][2] ='X';
// grid[3][2] ='X';

// //console.log(grid.length);

// /* let h=[];
// for(let i=0; i < grid.length; i++)
// {
// const x = grid[i].every((val, j, arr)=>
// val && arr[0] && h.push(val));
// if (x && h.length === grid.length) {
//   break;
// }
// } */

// let v=[];
// for(let i=0; i < grid.length; i++) {
//   v=[];
//   for(let j=0; j < grid.length; j++) {
//   v.push(grid[j][i])
// }
// const x = v.every((val, j, arr)=> val && arr[0])
// if (x && v.length === grid.length) {
//   console.log(v);
//   break;
// }
// }

function horizontal(grid) {
  let h = {}; //y >row x-> col
  let temp = [];
  for (let y = 0; y < grid.length; y++) {
    const check = grid[y].every(
      (val, index, arr) => val && arr[0] && temp.push(val)
      //h.push({ y: y, x: x, index: y * (grid.length - 1) })
    );
    if (check && temp.length === grid.length) {
      h = { type: "H", index: y };
      break;
    }
  }
  return h;
}

function vertical(grid) {
  //y - row x - col
  let v = {};
  let temp = [];
  // iterate vertically
  for (let y = 0; y < grid.length; y++) {
    temp = [];
    for (let x = 0; x < grid.length; x++) {
      temp.push(grid[x][y]);
    }
    console.log(temp);
    const check = temp.every((val, index, arr) => val && arr[0]);
    if (check && temp.length === grid.length) {
      v = { type: "V", index: y };
      break;
    }
  }
  return v;
}

function diagonal(grid) {
  let check = false;
  let temp1 = [];
  let temp2 = [];

  for (let i = 0, j = grid.length - 1; i <= grid.length - 1; i++) {
    temp1.push(grid[i][i]);
    temp2.push(grid[i][j--]);
  }
  // diagonal 1
  check = temp1.every((val, index, arr) => val && arr[0]);
  if (check && temp1.length === grid.length) {
    return { type: "D", index: 0 };
  }
  // diagonal 2
  check = temp2.every((val, index, arr) => val && arr[0]);
  if (check && temp2.length === grid.length) {
    return { type: "D", index: 1 };
  }
  return null;
}

function checkForWin(grid) {
  //console.log(horizontal(grid));
  //console.log(vertical(grid));
  console.log(diagonal(grid));
}

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

      checkForWin(grid);
      //if (checkForWin(grid)) {
      //  nextState.status = "success";
      //  return nextState;
      //}

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
