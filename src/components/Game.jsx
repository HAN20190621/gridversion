import React, { useCallback, useEffect, useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import Board from './Board';
import ToggleButton from './ToggleButton';
import Button from './Button';
import gameReducer from '../reducers/gameReducer/gameReducer';
import { initialiseGame } from '../reducers/gameReducer/constants';

// import _ from "lodash"; // included in Create-React-App by default and imported as underscore

export default function Game(props) {
  const [game, dispatch] = useReducer(
    gameReducer,
    initialiseGame(props.players, moveTo)
  );

  const [sortAsc, setSortAsc] = useState(true);
  const [status, setStatus] = useState(''); //game status
  const [jumpToInd, setJumpToInd] = useState(false);

  function setMoveTo(x, y, length) {
    const desc = `Go to move ${length} (${y}, ${x})`;
    return () => {
      return (
        <li key={`${y}-${x}`}>
          <button
            onClick={() => {
              moveTo(length);
            }}
          >
            {desc}
          </button>
        </li>
      );
    };
  }

  // on click - record the move
  function handleClick(x, y, index) {
    //console.log(game.history);
    // set current player - next turn
    // update history
    dispatch({
      type: 'click',
      payload: {
        x: x,
        y: y,
        index: index,
        setMoveTo: setMoveTo,
      },
    });

    setJumpToInd(false);
  }

  //reset current winners
  //if score has been incremented and then move to was clicked
  // then re-adjust score/winners
  const doSetGameStatus = useCallback(() => {
    const { history, players, player, winners, turn, gridSize } = game;
    const currentGame = history[history.length - 1];
    const { grid } = currentGame;
    const tempIdx = ((xo) => players.findIndex((player) => player.xo === xo))(
      turn
    );

    let tempStatus = '';
    if (winners.length > 0) {
      tempStatus = `Winner: ${player.xo}${player.name !== '' ? '-' : ''}${
        player.name
      }`;
    } else if (
      grid.flat().filter((item, index) => {
        return item !== null;
      }).length === gridSize
    ) {
      tempStatus = "It's a draw - no winner";
    } else {
      tempStatus = `Next player: ${turn}${
        players[tempIdx].name !== '' ? '-' : ''
      }${players[tempIdx].name}`;
    }
    setStatus(tempStatus);
  }, [game]);

  useEffect(() => {
    // winner, score and game status
    doSetGameStatus();
    //
  }, [doSetGameStatus]);

  function handleRestart() {
    const { players } = game;
    // reset game - players
    dispatch({
      type: 'request to start',
      payload: {
        players: players,
        moveTo: moveTo,
      },
    });
  }

  // jump to the selected position
  function moveTo(moveIndex) {
    dispatch({
      type: 'move to',
      payload: {
        moveIndex: moveIndex,
      },
    });
    if (moveIndex === game.moves.length - 1) return;
    // jump back to a step
    setJumpToInd(true);
  }

  function handleSort(sortOrder) {
    setSortAsc(sortOrder);
  }

  function getScore() {
    const { players } = game;
    let temp = '';
    players.forEach((item) => {
      // console.log(item);
      temp += `${item.name}-${item.score.toString()} `;
    });
    return temp;
  }

  function getWinners() {
    const { winners } = game;
    return winners;
  }

  function getMoves() {
    const { moves } = game;
    return moves;
  }

  function getSelIndex() {
    const { selIndex } = game;
    return selIndex;
  }

  function getStepNumber() {
    const { moves } = game;
    // remove the game start
    return moves.length - 1;
  }

  function getCurrentPlayer() {
    const { currentPlayer } = game;
    return currentPlayer;
  }

  function getGrid() {
    const { history } = game;
    return history[history.length - 1].grid;
  }

  return (
    <div className='game'>
      <>
        <Button
          text='Restart'
          colour='green'
          onClick={() => {
            //handle-restart - request to restart
            handleRestart();
          }}
        />
        <div>{status}</div>
        <div>Step number: {getStepNumber()}</div>
        <div>Score: {getScore()}</div>
        <div
          className='board-container'
          // style={{
          //   width: boardPos.width + 'px',
          //   height: boardPos.height + 'px',
          // }}
        >
          <div className='board'>
            <Board
              grid={getGrid()}
              winners={getWinners()}
              player={getCurrentPlayer()}
              handleClick={handleClick}
              selIndex={getSelIndex()}
              jumpToInd={jumpToInd}
            />
            <div className='game-info'>
              <ToggleButton
                toggle={handleSort}
                labels={['Desc', 'Asc']}
                changeOpacity={false}
              />
              <ol reversed={!sortAsc}>
                {sortAsc
                  ? getMoves().slice().sort()
                  : getMoves().slice().reverse()}
              </ol>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

const initialisePlayers = () => {
  const players = [
    {
      rank: 1,
      name: 'Hannah',
      colour: 'pink',
      xo: 'X',
      status: '',
      score: 0,
    },
    {
      rank: 2,
      name: 'PeterPan',
      colour: 'yellow',
      xo: 'O',
      status: '',
      score: 0,
    },
  ];
  const xoId = Math.floor(Math.random() * 2); // where 1 - X  2 - O
  const xo = ['X', 'O'][xoId];
  players[xoId].xo = xo;
  players[xoId === 0 ? 1 : 0].xo = xo === 'X' ? 'O' : 'X';
  return players;
};

Game.propTypes = {
  players: PropTypes.array,
  index: PropTypes.number,
};

Game.defaultProps = {
  players: initialisePlayers(),
  squares: Array(9).fill(null),
  winners: [],
  selItems: [0, 12, 3, 4],
  jumpToInd: true,
  onClick: () => {},
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
