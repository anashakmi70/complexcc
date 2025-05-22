// HomePage.js
import React, { useState } from 'react';
import './HomePage.css';

function HomePage({ setMode, setPlayerNames, handleReset, playerNames }) {
    const [names, setNames] = useState(Array.isArray(playerNames) && playerNames.length ? playerNames : ['', '', '', '']);

  const startGame = (mode) => {
    const filled = names.map((n, i) => n || `P${i + 1}`);
    setPlayerNames(mode === 'free' ? filled : [filled[0] || 'Team 1', filled[1] || 'Team 2']);
    setMode(mode);
  };

  return (
    <div className="home-page">
      <h1>Complex CC</h1>
      {names.map((name, i) => (
        <input
          key={i}
          placeholder={`Player ${i + 1}`}
          value={names[i]}
          onChange={(e) => {
            const updated = [...names];
            updated[i] = e.target.value;
            setNames(updated);
          }}
        />
      ))}
      <button onClick={() => startGame('free')}>Free-for-all</button>
      <button onClick={() => startGame('partners')}>Partners</button>
      <button className="reset" onClick={handleReset}>Reset Scores</button>
    </div>
  );
}

export default HomePage;
