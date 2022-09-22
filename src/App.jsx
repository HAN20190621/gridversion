import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import About from './components/About';
import Footer from './components/Footer';
import Header from './components/Header';
import Players from './components/Players';
import Game from './components/Game';
import debounce from 'lodash/debounce';
import './styles.css';

//https://kyleshevlin.com/tic-tac-toe

//https://reactrouter.com/web/example/no-match
/*
Based on the documentation,
useEffect can return a "cleanup" function.
this function will not be invoked on the first useEffect call,
only on subsequent calls.

Therefore, if we use the useEffect hook
with no dependencies at all,
the hook will be called only when the component is mounted
and the "cleanup" function is called
when the component is unmounted.

useEffect(() => {
    console.log('componentDidMount');
    return () => {
        console.log('componentWillUnmount');
    };
}, []);
*/
//https://stackoverflow.com/questions/65402977/how-to-observe-when-window-resize-stop-in-react

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

const App = () => {
  // const location = useLocation();
  const [resizing, setResizing] = useState(false); // boolean to indicate window is resizing
  const [coords, setCoords] = useState({}); // window coordinates
  const [players, setPlayers] = useState(initialisePlayers());
  const appRef = useRef(null);

  const updateWindowCoords = () => {
    let timeout;
    clearTimeout(timeout);
    setResizing(true);
    timeout = setTimeout(() => {
      setResizing(false);
    }, 200);
    const rect = appRef.current.getBoundingClientRect();
    setCoords({
      left: rect.x + rect.width / 2, // add half the width of the button for center
      top: rect.y + window.scrollY + 50, // add scrollY offset, as soon as getBoundingClientRect takes on screen coords
    });
  };

  const updateCoords = debounce(updateWindowCoords, 100);

  useEffect(() => {
    // event listener
    window.addEventListener('resize', updateCoords);
    return () => {
      window.removeEventListener('resize', updateCoords);
    };
  }, [updateCoords]);

  function handleSetPlayers(players) {
    //console.log(players);
    setPlayers(players);
  }

  return (
    <div ref={appRef} className='container' style={{ ...styles.app, coords }}>
      <Router>
        <Header title='tik-tak-toe' resizing={resizing} />
        <Switch>
          <Route
            path='/players'
            render={(props) => (
              <Players
                {...props}
                resizing={resizing}
                players={players}
                setPlayers={handleSetPlayers}
              />
            )}
          />
          <Route
            path='/game'
            render={(props) => (
              <Game {...props} players={players} resizing={resizing} />
            )}
          />
          <Footer />
        </Switch>
      </Router>
    </div>
  );
};

const styles = {
  app: {
    position: 'absolute',
    margin: '20px 20px',
  },
  //width: 200,
  //transform: "translate(-100px, -100%)"
};

export default App;

/*
https://stackoverflow.com/questions/39910041/how-to-route-without-reloading-the-whole-page
https://ui.dev/react-router-v4-pass-props-to-components/
<Route
  path='/dashboard'
  render={(props) => (
    <Dashboard {...props} isAuthed={true} />
  )}
/>
So to recap, if you need to pass a prop to a component being rendered by
React Router v4, instead of using Routes component prop, use its render prop.
With render, you’re in charge of  creating the element and can pass
the component any props you’d like.*/

//https://reactrouter.com/web/example/auth-workflow
//https://stackoverflow.com/questions/46820682/how-do-i-reload-a-page-with-react-router
//https://stackoverflow.com/questions/66881928/how-can-you-initialize-a-child-components-state-from-inside-a-parent-component-i
