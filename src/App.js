// App.js
import React, { useState } from 'react';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import './App.css';

function App() {
  const [mode, setMode] = useState(null);
  const [playerNames, setPlayerNames] = useState([]);
  const [resetFlag, setResetFlag] = useState(false);
  const [scores, setScores] = useState({});
  const [rounds, setRounds] = useState({});
  const [cardCounts, setCardCounts] = useState({
    l6oosh: 0, diamonds: 0, queens: [], kings: [],
  });

  const handleReset = () => {
    setScores({});
    setRounds({});
    setCardCounts({ l6oosh: 0, diamonds: 0, queens: [], kings: [] });
    setPlayerNames([]);
    setMode(null);
  };

  return (
    <div className="app">
      {!mode ? (
        <HomePage
          setMode={setMode}
          setPlayerNames={setPlayerNames}
          playerNames={playerNames}
          handleReset={handleReset}
        />
      ) : (
        <GamePage
          mode={mode}
          resetFlag={resetFlag}
          playerNames={playerNames}
          scores={scores}
          setScores={setScores}
          rounds={rounds}
          setRounds={setRounds}
          cardCounts={cardCounts}
          setCardCounts={setCardCounts}
          goHome={() => setMode(null)}
        />
      )}
    </div>
  );
}

export default App;
