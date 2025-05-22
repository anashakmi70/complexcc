// src/GameTracker.js
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaGem, FaCrown, FaChessQueen } from "react-icons/fa";
import { CgCardSpades } from "react-icons/cg";
import { useScoreStore } from "./useScoreStore";

const maxValues = {
  L6oosh: 13,
  Diamonds: 13,
  Queens: 4,
  King: 1,
};

const categories = [
  { label: "L6oosh", icon: <CgCardSpades color="#f87171" /> },
  { label: "Diamonds", icon: <FaGem color="#60a5fa" /> },
  { label: "Queens", icon: <FaChessQueen color="#facc15" /> },
  { label: "King", icon: <FaCrown color="#a78bfa" /> },
];

function GameTracker() {
  const { roundId, gameId } = useParams();
  const navigate = useNavigate();
  const { scores, setScores, names, setNames } = useScoreStore();
  const [modalInfo, setModalInfo] = useState(null);
  const [showScoreSheet, setShowScoreSheet] = useState(false);

  const roundScores = scores[roundId][gameId];

  const handleNameChange = (index, value) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  const openModal = (playerIdx, catLabel) => {
    setModalInfo({ playerIdx, catLabel, doubled: false, playedBy: -1 });
  };

  const closeModal = () => setModalInfo(null);

  const submitModal = () => {
    const { playerIdx, catLabel, doubled, playedBy } = modalInfo;
    const newScores = { ...scores };
    const player = [...newScores[roundId][gameId]];
    const max = maxValues[catLabel];

    const currentCards = player[playerIdx][catLabel];
    const totalUsed = player.reduce((sum, p) => sum + p[catLabel].length, 0);

    if (totalUsed >= max) {
      closeModal();
      return;
    }

    const newCard = {
      doubled,
      playedBy: doubled && playedBy !== -1 ? playedBy : null,
    };
    currentCards.push(newCard);

    newScores[roundId][gameId] = player;
    setScores(newScores);
    closeModal();
  };

  const cardsLeft = () => {
    const playerData = scores[roundId][gameId];
    const left = {};
    categories.forEach(({ label }) => {
      const totalUsed = playerData.reduce((sum, p) => sum + p[label].length, 0);
      left[label] = maxValues[label] - totalUsed;
    });
    return left;
  };

  const updateCount = (playerIdx, catLabel, delta) => {
    const newScores = { ...scores };
    const player = [...newScores[roundId][gameId]];
    const currentCards = player[playerIdx][catLabel];

    if (delta === 1) {
      if (["Queens", "King"].includes(catLabel)) {
        openModal(playerIdx, catLabel);
        return;
      }
      const totalUsed = player.reduce((sum, p) => sum + p[catLabel].length, 0);
      if (totalUsed >= maxValues[catLabel]) return;
      currentCards.push({});
    } else {
      if (currentCards.length > 0) currentCards.pop();
    }

    newScores[roundId][gameId] = player;
    setScores(newScores);
  };

  const calculateScore = (rId, gId, playerIdx) => {
    let score = 0;
    const player = scores[rId][gId][playerIdx];

    for (const cat of categories) {
      const cards = player[cat.label];
      cards.forEach((card) => {
        switch (cat.label) {
          case "L6oosh":
            score += -15;
            break;
          case "Diamonds":
            score += -10;
            break;
          case "Queens":
            score += card.doubled ? -50 : -25;
            break;
          case "King":
            score += card.doubled ? -150 : -75;
            break;
          default:
            break;
        }
      });
    }

    scores[rId][gId].forEach((other, idx) => {
      if (idx === playerIdx) return;
      ["Queens", "King"].forEach((catLabel) => {
        const cards = other[catLabel];
        cards.forEach((card) => {
          const bonus = catLabel === "Queens" ? 25 : 75;
          if (card.doubled && card.playedBy === playerIdx) {
            score += bonus;
          }
        });
      });
    });

    return score;
  };

  const calculateCumulativeScore = (playerIdx) => {
    let totalScore = 0;
    const sortedRounds = Object.keys(scores).sort((a, b) => parseInt(a) - parseInt(b));
    for (const rId of sortedRounds) {
      const games = scores[rId];
      const sortedGames = Object.keys(games).sort((a, b) => parseInt(a) - parseInt(b));
      for (const gId of sortedGames) {
        if (
          parseInt(rId) < parseInt(roundId) ||
          (parseInt(rId) === parseInt(roundId) && parseInt(gId) <= parseInt(gameId))
        ) {
          totalScore += calculateScore(rId, gId, playerIdx);
        }
      }
    }
    return totalScore;
  };

  const allScores = Object.entries(scores).flatMap(([rId, games]) =>
    Object.entries(games).map(([gId, playerData]) => ({
      round: rId,
      game: gId,
      totals: playerData.map((_, idx) => calculateScore(rId, gId, idx)),
    }))
  );

  const goToNextGame = () => {
    const currentRound = parseInt(roundId);
    const currentGame = parseInt(gameId);
    if (currentGame === 1) {
      navigate(`/round/${currentRound}/game/2`);
    } else if (currentGame === 2 && currentRound < 4) {
      navigate(`/round/${currentRound + 1}/game/1`);
    } else {
      alert("🎉 You've completed all rounds!");
    }
  };

  return (
    <div className="counter-page">
      <h2>Round {roundId} - Game {gameId}</h2>
      <div className="players-grid">
        {roundScores.map((playerScore, i) => (
          <div key={i} className="player-card">
            <input
              className="name-input"
              value={names[i]}
              onChange={(e) => handleNameChange(i, e.target.value)}
            />
            {categories.map((cat) => (
              <div key={cat.label} className="controls">
                <span>{cat.icon}</span>
                <button onClick={() => updateCount(i, cat.label, -1)}>-</button>
                <span>{playerScore[cat.label].length}</span>
                <button onClick={() => updateCount(i, cat.label, 1)}>+</button>
              </div>
            ))}
            <div className="score-display">Total: {calculateCumulativeScore(i)}</div>
          </div>
        ))}
      </div>

      {modalInfo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modalInfo.catLabel} Options</h3>
            <label>
              <input
                type="checkbox"
                checked={modalInfo.doubled}
                onChange={(e) =>
                  setModalInfo({
                    ...modalInfo,
                    doubled: e.target.checked,
                    playedBy: e.target.checked ? -1 : null,
                  })
                }
              />
              Doubled?
            </label>
            {modalInfo.doubled && (
              <select
                value={modalInfo.playedBy}
                onChange={(e) =>
                  setModalInfo({
                    ...modalInfo,
                    playedBy: parseInt(e.target.value),
                  })
                }
              >
                <option value={-1}>No one</option>
                {names.map((n, idx) => (
                  <option key={idx} value={idx}>{n}</option>
                ))}
              </select>
            )}
            <button onClick={submitModal}>Confirm</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{
        position: "fixed",
        top: 10,
        right: 10,
        backgroundColor: "#222",
        color: "#eee",
        padding: "8px 12px",
        borderRadius: "8px",
        fontSize: "0.9rem",
        zIndex: 1000,
        boxShadow: "0 0 8px rgba(0,0,0,0.5)"
      }}>
        {Object.entries(cardsLeft()).map(([cat, count]) => (
          <div key={cat} style={{ marginBottom: 4 }}>
            <span style={{ color: count === 0 ? 'red' : 'inherit', fontWeight: count === 0 ? 'bold' : 'normal' }}>
              {cat}
            </span>: {count}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: "20px",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        <Link to={`/round/${roundId}`}>
          <button className="back-btn">← Back to Round {roundId}</button>
        </Link>
        <button onClick={goToNextGame}>→ Next Game</button>
        <button onClick={() => setShowScoreSheet(true)}>📊 View Score Sheet</button>
      </div>

      {showScoreSheet && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "90%", overflowX: "auto" }}>
            <h3>Score Sheet</h3>
            <table style={{ width: "100%", color: "#fff", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Game</th>
                  {names.map((n, idx) => (
                    <th key={idx}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allScores.map((entry, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: "4px 8px" }}>
                      Round {entry.round} - Game {entry.game}
                    </td>
                    {entry.totals.map((score, i) => (
                      <td key={i} style={{ padding: "4px 8px" }}>{score}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setShowScoreSheet(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameTracker;
