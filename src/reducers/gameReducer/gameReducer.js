import { NEXT_TURN } from "../gameReducer/constants";

// Simple way to deeply clone an array or object
const clone = (x) => JSON.parse(JSON.stringify(x));

// function horizontal(grid) {
//   let temp = [];
//   for (let y = 0; y < grid.length; y++) {
//     const check = grid[y].every(
//       (val, index, arr) => val && arr[0] && temp.push(val)
//       //h.push({ y: y, x: x, index: y * (grid.length - 1) })
//     );
//     if (check && temp.length === grid.length) {
//       return { type: "H", index: y };
//     }
//   }
//   return false;
// }

// function vertical(grid) {
//   //y - row x - col
//   let temp = [];
//   // iterate vertically
//   for (let y = 0; y < grid.length; y++) {
//     temp = [];
//     for (let x = 0; x < grid.length; x++) {
//       temp.push(grid[x][y]);
//     }
//     const check = temp.every((val, index, arr) => val && arr[0]);
//     if (check && temp.length === grid.length) {
//       return { type: "V", index: y };
//     }
//   }
//   return false;
// }

// function diagonal(grid) {
//   let temp1 = [];
//   let temp2 = [];

//   for (let i = 0, j = grid.length - 1; i <= grid.length - 1; i++) {
//     temp1.push(grid[i][i]);
//     temp2.push(grid[i][j--]);
//   }
//   // diagonal 1
//   let check = temp1.every((val, index, arr) => val && arr[0]);
//   if (check && temp1.length === grid.length) {
//     return { type: "D", index: 0 };
//   }
//   // diagonal 2
//   check = temp2.every((val, index, arr) => val && arr[0]);
//   if (check && temp2.length === grid.length) {
//     return { type: "D", index: 1 };
//   }
//   return null;
// }

function checkForWin(grid) {
  //let winner = {};
  let check;
  let v = [];
  let d1 = [];
  let d2 = [];

  // if number of items are < grid.length then jsut exit
  if (
    grid.flat().map((item) => {
      return item;
    }).length <
    grid.length - 1
  )
    return {};

  for (let i = 0, j = grid.length - 1; i <= grid.length - 1; i++, j--) {
    grid[i][i] && d1.push({ val: grid[i][i], index: `${i}${i}` }); //{ r: i, c: i } }); // diagonal 1
    grid[j][i] && d2.push({ val: grid[j][i], index: `${j}${i}` }); //{ r: j, c: i } }); // diagonal 2

    //if (i === 3) console.log(d2);

    // horizontal
    if (grid[i].length === grid.length) {
      check = grid[i].every((val, index, arr) => val && val === arr[0]);
      if (check) {
        return grid[i].map((item, index) => {
          return `${i}${index}`; //{ r: i, c: index };
        }); //return { type: "H", index: i };
      }
    }
    // vertical
    v = grid
      .map((item, index) => {
        return item[i];
      })
      .filter((item, index) => {
        return item;
      });

    if (v.length === grid.length) {
      check = v.every((item, index, arr) => {
        return item && item === arr[0];
      });

      if (check) {
        return v.map((item, index) => {
          // return { r: index, c: i };
          return `${index}${i}`;
        });
      }
    }
    // diagonal

    if (d1.length === grid.length) {
      check = d1.every(
        (item, index, arr) => item.val && item.val === arr[0].val
      );
      if (check)
        return d1.map((item, index) => {
          return item.index;
        }); //return { type: "D", index: 0 };
    }
    // diagonal 2
    if (d2.length === grid.length) {
      check = d2.every(
        (item, index, arr) => item.val && item.val === arr[0].val
      );
      if (check)
        return d2.map((item, index) => {
          return item.index;
        }); //return { type: "D", index: 0 };
    }
  }

  // draw
  // check =
  //   grid.flat().filter((item) => {
  //     return item;
  //   }).length ===
  //   grid.length * grid.length;

  return [];
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
      const { x, y, index, setMoveTo } = action.payload;
      // Since we need immutable updates, I often find the simplest thing to do
      // is to clone the current state, and then use mutations on the clone to
      // make updates for the next state
      //const nextState = clone(state);
      //const cloned = Object.assign({}, history);
      const nextState = Object.assign({}, state);

      const { history, turn, players, moves } = nextState;

      const { grid } = clone(history[history.length - 1]); // advance

      // If the cell already has a value, clicking on it should do nothing
      // Also, pay attention, because our rows are first, the `y` value is the
      // first index, the `x` value second. This takes some getting used to.
      if (grid[y][x]) {
        return state;
      }

      //console.log(turn);

      // If we're here in our program, we can assign this cell to the current
      // `turn` value
      grid[y][x] = turn;

      const tempIdx = ((xo) => players.findIndex((player) => player.xo === xo))(
        NEXT_TURN[turn]
      );

      const player = players[tempIdx];

      // // //     players: [
      // // //       ...state.players.slice(0, tempIdx),
      // // //       {
      // // //         ...state.players[tempIdx],
      // // //         score: state.players[tempIdx].score + 1
      // // //       },
      // // //       ...state.players.slice(tempIdx + 1)
      // // //     ],

      // take a copy of the previous history and append the new one
      // console.log("hannah=", history);

      const newHistory = [
        ...state.history,
        {
          x: x,
          y: y,
          index: index,
          grid: grid,
          turn: turn,
          player: player
        }
      ];

      nextState.history = newHistory;
      nextState.player = player;
      nextState.winners = checkForWin(grid);
      nextState.selIndex = index;
      // Now that we've used this turn, we need to set the next turn. It might
      // be overkill, but I've used an object enum to do this.
      nextState.turn = NEXT_TURN[turn];
      // new move
      const newMove = setMoveTo(x, y, newHistory.length - 1)();
      nextState.moves = [...moves, newMove];

      // if (checkForDraw(flatGrid)) {
      //   return getInitialState();
      // }

      return nextState;
    }

    case "move to": {
      // get the previous step
      const { moveIndex } = action.payload;

      // go back a step
      //const nextState = clone(state);
      const { history, moves } = state; //nextState;
      // get history

      const newHistory = clone(
        moveIndex === 0 ? history.slice(0, 1) : history.slice(0, moveIndex + 1)
      );
      const { turn, player, winners } = newHistory[newHistory.length - 1];
      //
      //console.log(turn);
      //
      const newMoves = moves.slice(0, moveIndex + 1);
      // set new object
      return {
        ...state,
        turn: NEXT_TURN[turn],
        player: player,
        winners: winners,
        history: newHistory,
        moves: newMoves
      };
      // nextState.turn = turn;
      // nextState.player = player;
      // nextState.winners = winners;
      // nextState.history = newHistory;
      // return nextState;
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
