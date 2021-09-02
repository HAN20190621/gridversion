import React, { useEffect, useState, useRef } from 'react';
import Modal from './Modal';
import Player from './Player';
import EditPlayer from './EditPlayer';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

// players, handlePlayers
export default function Players({ players, setPlayers, resizing }) {
  const [init, setInit] = useState(false);
  const [show, setShow] = useState(false);
  const [dirty, setDirty] = useState([]);
  const [currPlayer, setCurrPlayer] = useState(null);
  const [selTarget, setSelTarget] = useState(null);
  const [coords, setCoords] = useState({});
  const divRef = useRef(null);

  //
  const [locationKeys, setLocationKeys] = useState([]);
  const history = useHistory();

  useEffect(() => {
    return history.listen((location) => {
      if (history.action === 'PUSH') {
        setLocationKeys([location.key]);
        //console.log(location.key);
        //console.log("push");
      }

      if (history.action === 'POP') {
        if (locationKeys[1] === location.key) {
          //setLocationKeys(([_, ...keys]) => keys);
          //console.log("pop");
          //console.log(location.key);
          // Handle forward event
        } else {
          setLocationKeys((keys) => [location.key, ...keys]);
          //console.log("something else");
          //console.log(location.key);
          // Handle back event
        }
      }
    });
  }, [locationKeys, history]);

  useEffect(() => {
    if (init) return;
    setDirty([
      { rank: 1, isDirty: false },
      { rank: 2, isDirty: false },
    ]);
    setInit(true);
  }, [init, players]);

  useEffect(() => {
    let rect1 = divRef.current.getBoundingClientRect();
    setCoords({ top: rect1.bottom, left: rect1.lef });
  }, [resizing]);

  function setIsDirty(rank, isDirty) {
    const all = [...dirty];
    const index = all.findIndex((item) => item.rank === rank);
    all[index] = { rank, isDirty };
    setDirty(all);
  }

  function getIsDirty(rank) {
    const all = [...dirty];
    const index = all.findIndex((item) => item.rank === rank);
    return all[index].isDirty;
  }

  function handleClearName(player) {
    const newPlayers = [...players];
    const index = newPlayers.findIndex((item) => item.rank === player.rank);
    newPlayers[index] = player;
    setPlayers(newPlayers);
    setIsDirty(player.rank, false);
  }

  // save player details on form close
  function closeModal(player) {
    const newPlayer = { ...player };
    const newPlayers = [...players];
    const index = newPlayers.findIndex(
      (player) => player.rank === newPlayer.rank
    );
    newPlayers[index] = newPlayer;
    setPlayers(newPlayers);
    setCurrPlayer(null);
    setShow(false);
    setSelTarget(null);
  }

  const updatePlayerCoords = (control) => {
    const rect = control.getBoundingClientRect();
    setCoords({
      //left: rect.x + rect.width / 2, // add half the width of the button for center
      //top: rect.y + window.scrollY + 50, // add scrollY offset, as soon as getBoundingClientRect takes on screen coords
      left: rect.left - 38,
      top: rect.top + 12 + 50,
    });
  };

  function handleShowModal(show, player, target) {
    if (show) {
      // if show === false and target is null then closing
      const newPlayers = [...players];
      let newPlayer = { ...player };
      const update = currPlayer !== null;
      if (update) {
        if (currPlayer.rank !== player.rank && getIsDirty(currPlayer.rank)) {
          // then save previous player
          newPlayer = { ...currPlayer };
          newPlayer.name = selTarget.innerText;
          newPlayer.colour = selTarget.style.backgroundColor;
          // update the list
          const index = newPlayers.findIndex(
            (player) => player.rank === newPlayer.rank
          );
          newPlayers[index] = newPlayer;
          setPlayers(newPlayers);
        }
      }
      setCurrPlayer(player);
      setShow(show);
      setSelTarget(target);
    } else {
      closeModal(player);
    }
  }

  // on change - change the target
  function handleOnChange(player) {
    const newDirty = [...dirty];
    const index = newDirty.findIndex((item) => item.rank === player.rank);
    const dirtyItem = newDirty[index];
    // set isDirty = true
    if (!dirtyItem.isDirty) setIsDirty(dirtyItem.rank, true);
    selTarget.innerText = player.name;
    selTarget.style.backgroundColor = player.colour;
  }

  function handleUpdatePlayerCoords(newRef) {
    //setPlayerRef(newRef);
    updatePlayerCoords(newRef.current);
  }

  return (
    <>
      <div ref={divRef} className="players">
        {players.map((player, idx) => (
          <Player
            key={idx}
            id={idx}
            name={`player${player.rank}`}
            player={player}
            clearName={handleClearName}
            showModal={handleShowModal}
            handleUpdatePlayerCoords={handleUpdatePlayerCoords}
          />
        ))}
      </div>
      <Modal show={show} id="modal-root">
        <EditPlayer
          player={currPlayer}
          showModal={handleShowModal}
          onChange={handleOnChange}
          coords={coords}
        />
      </Modal>
    </>
  );
}

Players.propTypes = {
  players: PropTypes.array,
  setPlayers: PropTypes.func,
  resizing: PropTypes.bool,
};

Players.defaultProps = {
  players: [
    {
      rank: 1,
      name: 'tik-tak-toe',
      colour: 'green',
      xo: 'x',
      status: '',
      score: 0,
    },
    {
      rank: 2,
      name: 'coco',
      colour: 'yellow',
      xo: 'o',
      status: '',
      score: 0,
    },
  ],
  setPlayers: () => {},
};
