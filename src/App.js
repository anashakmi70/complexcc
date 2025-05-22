import React, { useState } from 'react';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import './App.css';

function App() {
  const [mode, setMode] = useState(null);
  const [resetFlag, setResetFlag] = useState(false);

  const handleReset = () => {
    setResetFlag(true);
    setTimeout(() => setResetFlag(false), 0);
    setMode(null);
  };

  return (
    <div className="app">
      {!mode ? (
        <HomePage setMode={setMode} handleReset={handleReset} />
      ) : (
        <GamePage mode={mode} resetFlag={resetFlag} />
      )}
    </div>
  );
}

export default App;
