import React, { useCallback, useEffect, useState, useReducer } from "react";
import PropTypes from "prop-types";
import Board from "./Board";
import ToggleButton from "./ToggleButton";
import Button from "./Button";
import gameReducer from "../reducers/gameReducer/gameReducer";
import { initialiseGame } from "../reducers/gameReducer/constants";
// import _ from "lodash"; // included in Create-React-App by default and imported as underscore

export default function Game(props) {
  const [history, setHistory] = useState({
    history: [
      {
        squares: Array(9).fill(null)
      }
    ]
  });

  const [game, dispatch] = useReducer(
    gameReducer,
    initialiseGame(props.players)
  );

  const [selItems, setSelItems] = useState([]);
  const [stepNumber, setStepNumber] = useState(0);
  const [isNext, setIsNext] = useState(true); // next player
  const [moves, setMoves] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [jumpToInd, setJumpToInd] = useState(false);
  const [status, setStatus] = useState(""); //game status
  // const [lineStyle, setLineStyle] = useState({});
  //const [target, setTarget] = useState(null);
  // const [boardPos, setBoardPos] = useState({});

  // const boardRef = useCallback((ref) => {
  //   //console.log(ref.getBoundingClientRect());
  //   setBoardPos(ref?.getBoundingClientRect());
  // }, []);

  // set winners
  useEffect(() => {
    const tempHistory = history.history.slice(0, stepNumber + 1);
    const curr = tempHistory[tempHistory.length - 1];
    const squares = curr.squares.slice(); // copy
    //
    const lines = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 4, 6],
      [2, 5, 8],
      [3, 4, 5],
      [6, 7, 8]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        // get the last click item and calc the offset
        dispatch({
          type: "update winners",
          payload: { xo: squares[a], winners: [a, b, c] }
        });
      }
    }
  }, [history, stepNumber]);

  function handleClick(item) {
    const copyHistory = history.history.slice(0, stepNumber + 1); // advance
    const current = copyHistory[copyHistory.length - 1];
    const squares = current.squares.slice(); // copy
    //
    if (game.winners.winners.length === 3 || squares[item]) return; // check if item exists // calculate winner????
    //
    squares[item] = isNext
      ? game.firstPlayer === "X"
        ? "X"
        : "O"
      : game.firstPlayer === "X"
      ? "O"
      : "X";
    //console.log(squares);
    setHistory((prev) => ({
      ...prev,
      history: copyHistory.concat([{ squares }])
    }));
    setSelItems(selItems.slice(0, stepNumber).concat(item));
    setStepNumber(copyHistory.length);
    setIsNext(!isNext);
    // get current player
    dispatch({
      type: "update current player",
      payload: {
        xo: squares[item]
      }
    });
    if (jumpToInd) setJumpToInd(false);
  }

  const doSetMoves = useCallback(() => {
    const newMoves = history.history.map((hist, move) => {
      const row = [0, 1, 2].includes(selItems[move - 1])
        ? "0"
        : [3, 4, 5].includes(selItems[move - 1])
        ? "1"
        : [6, 7, 8].includes(selItems[move - 1])
        ? "2"
        : "";
      const desc = move
        ? `Go to move ${move} (${selItems[move - 1] % 3}, ${row})`
        : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => {
              setJumpToInd(true);
              jumpTo(move);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });
    setMoves(newMoves);
  }, [history, selItems]);

  //reset current winners
  useEffect(() => {
    if (jumpToInd) {
      if (selItems.length !== stepNumber) {
        dispatch({
          type: "reset winners",
          payload: { jumpToInd: jumpToInd }
        });
      }
    }
  }, [jumpToInd, stepNumber, selItems]);

  const doSetGameStatus = useCallback(() => {
    const { players, currentPlayer, firstPlayer, winners } = game;
    let { xo } = currentPlayer;
    const currentGame = history.history[stepNumber];
    const tempIdx = ((xo) => players.findIndex((player) => player.xo === xo))(
      xo
    );
    const player = players[tempIdx];
    let tempStatus;
    if (winners.winners && winners.winners.length > 0) {
      tempStatus = `Winner: ${player.xo}${player.name !== "" ? "-" : ""}${
        player.name
      }`;
    } else if (
      currentGame.squares.filter((item) => item == null).length === 0
    ) {
      tempStatus = "No winner - draw!";
    } else {
      xo = isNext
        ? firstPlayer === "X"
          ? "X"
          : "O"
        : firstPlayer === "X"
        ? "O"
        : "X";
      tempStatus = `Next player: ${xo}${player.name !== "" ? "-" : ""}${
        player.name
      }`;
    }
    setStatus(tempStatus);
  }, [game, history, stepNumber, isNext]);

  useEffect(() => {
    // get player moves
    doSetMoves();
    // winner, score and game status
    doSetGameStatus();
    //
  }, [doSetMoves, doSetGameStatus]); // history.history[stepNumber].squares );

  // set the width and height of the board-container
  // useEffect(() => {
  //   if (boardRef === null) return;
  //   const pos = boardRef.current.getBoundingClientRect();
  //   setBoardDim({ width: pos.width, height: pos.height });
  // }, [boardRef]);

  function handleRestart() {
    setHistory({
      history: [
        {
          squares: Array(9).fill(null)
        }
      ]
    });
    setSelItems([]);
    setStepNumber(0);
    setIsNext(true);
    setMoves([]);
    setSortAsc(true);
    // reset game - players
    dispatch({ type: "request to start" });
  }

  function jumpTo(step) {
    setStepNumber(step);
    setIsNext(step % 2 === 0);
  }

  function handleSort(sortOrder) {
    setSortAsc(sortOrder);
  }

  function getScore() {
    const { players } = game;
    let temp = "";
    players.forEach((item) => {
      temp += `${item.name}-${item.score.toString()} `;
      //console.log(item.score);
    });
    return temp;
  }

  function getWinners() {
    const { winners } = game;
    console.log(winners.winners);
    return winners.winners;
  }

  function getCurrentPlayer() {
    const { currentPlayer } = game;
    return currentPlayer;
  }

  return (
    <div className="game">
      <>
        <Button
          text="Restart"
          colour="green"
          onClick={() => {
            //handle-restart - request to restart
            handleRestart();
          }}
        />
        <div>{status}</div>
        <div>({getScore()})</div>
        <div>stepNumber = {stepNumber}</div>
        {/* <div ref={handleLineStyleRef} className="board"> */}
        <div
          className="board-container"
          // style={{
          //   width: boardPos.width + 'px',
          //   height: boardPos.height + 'px',
          // }}
        >
          <div className="board">
            <Board
              squares={history.history[stepNumber].squares}
              winners={getWinners()}
              selItems={selItems}
              stepNumber={stepNumber}
              currPlayer={getCurrentPlayer()}
              onClick={handleClick}
              jumpToInd={jumpToInd} // indicate user to move to previous move
            />
          </div>
          <div
            className="board stack-top"
            // style={{
            //   width: boardPos.width + 'px',
            //   height: boardPos.height + 'px',
            // }}
          />
        </div>
        <div className="game-info">
          <ToggleButton
            toggle={handleSort}
            labels={["Desc", "Asc"]}
            changeOpacity={false}
          />
          <ol reversed={!sortAsc}>
            {sortAsc ? moves.slice().sort() : moves.slice().reverse()}
          </ol>
        </div>
      </>
    </div>
  );
}

const initialisePlayers = () => {
  const players = [
    {
      rank: 1,
      name: "",
      colour: "",
      xo: "",
      status: "",
      score: 0
    },
    {
      rank: 2,
      name: "",
      colour: "",
      xo: "",
      status: "",
      score: 0
    }
  ];
  const xoId = Math.floor(Math.random() * 2); // where 1 - X  2 - O
  const xo = ["X", "O"][xoId];
  players[xoId].xo = xo;
  players[xoId === 0 ? 1 : 0].xo = xo === "X" ? "O" : "X";
  return players;
};

Game.propTypes = {
  players: PropTypes.array,
  index: PropTypes.number
};

Game.defaultProps = {
  players: initialisePlayers(),
  squares: Array(9).fill(null),
  winners: ["x"],
  selItems: [0, 12, 3, 4],
  jumpToInd: true,
  onClick: () => {}
};

//https://css-tricks.com/getting-to-know-the-usereducer-react-hook/
// https://nikgrozev.com/2019/04/07/reacts-usecallback-and-usememo-hooks-by-example/
// https://dev.to/danielleye/react-class-component-vs-function-component-with-hooks-13dg
// import styled from "styled-components";
// https://stackoverflow.com/questions/60503263/react-hooks-how-to-target-an-element-child-with-useref-with-a-variable-decla
// //https://flaviocopes.com/react-hook-usecallback/

// https://stackblitz.com/edit/react-r9opxy
// const usePrevious = (value) => {
//   const ref = useRef();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// };
