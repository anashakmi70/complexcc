import React, { useState } from "react";
import GameTracker from "./GameTracker";
import { useScoreStore } from "./useScoreStore";
import "./App.css";

function App() {
  const [roundId, setRoundId] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [showScoreSheet, setShowScoreSheet] = useState(false);
  const { resetScores } = useScoreStore();

  const handleGameSelect = (round, game) => {
    setRoundId(round);
    setGameId(game);
  };

  const goHome = () => {
    setRoundId(null);
    setGameId(null);
  };

  return (
    <div className="app">
      {!roundId || !gameId ? (
        <div className="home">
          <h1>Game Tracker</h1>
          {[1, 2, 3, 4].map((round) => (
            <div key={round}>
              <h2>Round {round}</h2>
              <button onClick={() => handleGameSelect(round, 1)}>Game 1</button>
              <button onClick={() => handleGameSelect(round, 2)}>Game 2</button>
            </div>
          ))}
          <button onClick={resetScores}>Reset All Scores</button>
        </div>
      ) : (
        <div>
          <GameTracker
            roundId={String(roundId)}
            gameId={String(gameId)}
            goHome={goHome}
            goToNextGame={() => {
              if (gameId === 1) {
                setGameId(2);
              } else if (gameId === 2 && roundId < 4) {
                setRoundId(roundId + 1);
                setGameId(1);
              } else {
                alert("🎉 You've completed all rounds!");
              }
            }}
            showScoreSheet={() => setShowScoreSheet(true)}
          />
        </div>
      )}
      {showScoreSheet && (
        <ScoreSheetModal onClose={() => setShowScoreSheet(false)} />
      )}
    </div>
  );
}

export default App;
