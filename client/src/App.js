import React, { useState } from 'react';
import './Styles/App.css';
import Game from './Components/Game';

function App() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 1000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className={clicked ? 'glitch' : ''} onClick={handleClick}>
          MineSweeper
        </h1>
        <Game />
      </header>
    </div>
  );
}

export default App;