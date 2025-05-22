import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import RoundSelect from "./RoundSelect";
import GameTracker from "./GameTracker";
import "./App.css";
import { useScoreStore } from "./useScoreStore";

function Home() {
  const navigate = useNavigate();
  const resetScores = useScoreStore((state) => state.resetScores);

  const handleResetScores = () => {
    resetScores();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="home">
      <h1>Game Tracker</h1>
      <p>Select a Round:</p>
      <div className="button-grid">
        {[1, 2, 3, 4].map((round) => (
          <Link key={round} to={`/round/${round}`}>
            <button>Round {round}</button>
          </Link>
        ))}
      </div>

      <button className="back-btn" onClick={handleResetScores} style={{ marginTop: "40px" }}>
        🔄 Reset All Scores
      </button>
    </div>
  );
}

export default App;
