import React, { useRef, useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Player = (props) => {
  const [player, setPlayer] = useState({ ...props.player });
  const playerRef = useRef(null);

  useEffect(() => {
    setPlayer(props.player);
  }, [props.player]);

  function handleOnClick(event) {
    // check if the text has any value if so then save it before moving on
    // to be coded
    if (props.showModal === undefined) return;
    props.handleUpdatePlayerCoords(playerRef);
    props.showModal(true, player, event.target);
  }

  return (
    <>
      <div ref={playerRef} className="player-header">
        <div className="player-name">
          <span
            style={{ backgroundColor: player.colour }}
            onClick={handleOnClick}
          >
            {player.name === '' ? 'enter player name' : player.name}
          </span>
          {player.name === '' ? null : (
            <FaTimes
              style={{
                marginLeft: '5px',
                color: 'white',
                border: 'none',
                backgroundColor: '#c53257',
                borderRadius: '100%',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
              onClick={() => {
                const newPlayer = { ...player };
                newPlayer.name = '';
                newPlayer.colour = '';
                setPlayer(newPlayer);
                if (props.clearName !== undefined) props.clearName(newPlayer);
              }}
            />
          )}
        </div>
        <div>
          <span>
            {player.name === ''
              ? null
              : `player ${player.rank} ${
                  player.xo === '' ? '' : ` - ${player.xo}`
                }`}
          </span>
        </div>
      </div>
    </>
  );
};

Player.propTypes = {
  player: PropTypes.object,
  showModal: PropTypes.func,
  handleUpdatePlayerCoords: PropTypes.func,
  clearName: PropTypes.func,
};

Player.defaultProps = {
  player: { name: 'hannah', colour: 'green', rank: 0, xo: 'x' },
};

export default Player;
