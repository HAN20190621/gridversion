import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Square from './Square';
import Line from './Line';

//  https://www.pluralsight.com/guides/applying-classes-conditionally-react
const Board = ({
  squares,
  winners,
  selItems,
  stepNumber,
  currPlayer,
  jumpToInd,
  onClick,
}) => {
  // button positions for vertical pos=[0,1,2] horizontal pos=[0,3,6]
  const [positions, setPositions] = useState({});
  const winStyle = { color: currPlayer.colour, fontWeight: 'bold' };
  const normalStyle = {
    color: 'black',
    fontWeight: 'normal',
  }; // , color:'black'

  // useEffect(() => {
  //   console.log(Object.keys(positions).length);
  // }, [positions]);

  function setWinStyle(index) {
    // console.log('selItems=' + selItems + ' stepNumber=' + stepNumber);
    return winners.includes(index) || selItems[stepNumber - 1] === index
      ? winStyle
      : normalStyle; // selItems[stepNumber-1] === index
  }

  function renderSqr(r, i) {
    return (
      <div key={`br${i}`} className="board-row">
        {r.map((val, idx) => {
          const idx_ = i + idx;
          return (
            <div key={`col${idx_}`}>
              <Square
                key={idx_}
                style={jumpToInd ? normalStyle : setWinStyle(idx_)}
                value={squares[idx_]}
                idx={idx_}
                className={
                  'square' + ([6, 7, 8].includes(idx_) ? ' sh-lastRow' : '')
                }
                onClick={() => {
                  onClick(idx_);
                }}
                setPositions={setPositions}
              />
              {idx !== 2 ? (
                <div key={`sv${idx_}`} className={`sv${idx}`} />
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  function renderSquare() {
    const rows = [];
    for (let idx = 0; idx < squares.length; idx++) {
      const isOk = idx % 3 === 0;
      const r = isOk ? squares.slice(idx, idx + 3) : null;
      if (isOk) rows.push(renderSqr(r, idx));
    }
    return rows.map((row, idx) => (
      <div key={`r${idx}`}>
        {row}
        {idx !== 2 && <div className="sh" key={`sh${idx}`} />}
      </div>
    ));
  }

  return (
    <>
      <div>{renderSquare()}</div>
      {positions && winners && (
        <Line winners={winners} positions={positions}></Line>
      )}
    </>
  );
};

Board.propTypes = {
  squares: PropTypes.array,
  winners: PropTypes.array,
  selItems: PropTypes.array,
  stepNumber: PropTypes.number,
  currPlayer: PropTypes.object,
  jumpToInd: PropTypes.bool,
  onClick: PropTypes.func,
};

Board.defaultProps = {
  currPlayer: { colour: 'red' },
  squares: Array(9).fill(null),
  winners: [3, 4, 5],
  selItems: [0, 1, 2],
  jumpToInd: false,
  onClick: () => {},
};

export default Board;
