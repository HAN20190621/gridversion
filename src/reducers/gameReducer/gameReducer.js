import { NEXT_TURN, initialiseGame } from "../gameReducer/constants";

// Simple way to deeply clone an array or object
const clone = (x) => JSON.parse(JSON.stringify(x));

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
    // diagonal 1
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
      const { history, moves } = nextState;
      let { turn, winners } = nextState;
      const { grid } = clone(history[history.length - 1]); // advance

      // If the cell already has a value, clicking on it should do nothing
      // Also, pay attention, because our rows are first, the `y` value is the
      // first index, the `x` value second. This takes some getting used to.
      if (grid[y][x] || winners.length > 0) {
        return state;
      }

      //console.log(turn);

      //const grid_clone = clone(grid);
      // If we're here in our program, we can assign this cell to the current
      // `turn` value
      grid[y][x] = turn;

      let tempIdx = 0;
      let player = null;
      // check for win
      winners = checkForWin(grid); //grid);
      const win = winners.length > 0;
      // update the score
      if (win) {
        tempIdx = ((xo) =>
          nextState.players.findIndex((player) => player.xo === xo))(turn);
        nextState.players = [
          ...state.players.slice(0, tempIdx),
          {
            ...state.players[tempIdx],
            score: state.players[tempIdx].score + 1
          },
          ...state.players.slice(tempIdx + 1)
        ];
        //console.log("winners=", nextState.players, turn);
      } else {
        tempIdx = ((xo) =>
          nextState.players.findIndex((player) => player.xo === xo))(
          NEXT_TURN[turn]
        );
        turn = NEXT_TURN[turn];
      }

      player = nextState.players[tempIdx];

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
      nextState.winners = winners;
      nextState.selIndex = index;
      // Now that we've used this turn, we need to set the next turn. It might
      // be overkill, but I've used an object enum to do this.
      nextState.turn = turn;
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
      const { history, moves, winners, turn } = state; //nextState;

      if (moves.length - 1 === moveIndex) return state;

      let { players } = state;
      // get history
      const newHistory = clone(
        moveIndex === 0 ? history.slice(0, 1) : history.slice(0, moveIndex + 1)
      );
      const { player } = newHistory[newHistory.length - 1];
      //
      //console.log(turn);
      //

      if (winners.length > 0) {
        const tempIdx = ((xo) =>
          players.findIndex((player) => player.xo === xo))(turn);
        players = [
          ...state.players.slice(0, tempIdx),
          {
            ...state.players[tempIdx],
            score: state.players[tempIdx].score - 1
          },
          ...state.players.slice(tempIdx + 1)
        ];
      }

      const newMoves = moves.slice(0, moveIndex + 1);
      // update winners

      // set new object
      return {
        ...state,
        turn: turn,
        player: player,
        winners: [],
        history: newHistory,
        moves: newMoves,
        players: players
      };
      // nextState.turn = turn;
      // nextState.player = player;
      // nextState.winners = winners;
      // nextState.history = newHistory;
      // return nextState;
    }

    case "request to start": {
      const { players, moveTo } = action.payload;
      const newState = initialiseGame(players, moveTo);
      return newState;
    }

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
