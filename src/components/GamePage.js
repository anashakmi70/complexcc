import React, { useState, useEffect } from 'react';
import PlayerInput from './PlayerInput';
import ScoreSheet from './ScoreSheet';
import CardCounter from './CardCounter';
import './GamePage.css';

const roundNames = [
  'Complex 1.1', 'Complex 1.2', 'Complex 2.1', 'Complex 2.2',
  'Complex 3.1', 'Complex 3.2', 'Complex 4.1', 'Complex 4.2',
];

function GamePage({ mode, playerNames, goHome }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [roundStates, setRoundStates] = useState({});
  const [scores, setScores] = useState({});
  const [cardCounts, setCardCounts] = useState({
    l6oosh: 0,
    diamonds: 0,
    queens: [],
    kings: [],
  });
  const [showSheet, setShowSheet] = useState(false);

  const currentRound = roundNames[roundIndex];

  useEffect(() => {
    const roundData = roundStates[currentRound];
    if (roundData) {
      setScores({ ...roundData.scores });
      setCardCounts(JSON.parse(JSON.stringify(roundData.cardCounts)));
    } else {
      setScores({});
      setCardCounts({
        l6oosh: 0,
        diamonds: 0,
        queens: [],
        kings: [],
      });
    }
  }, [roundIndex]);

  const saveRound = () => {
    setRoundStates(prev => ({
      ...prev,
      [currentRound]: {
        scores: { ...scores },
        cardCounts: JSON.parse(JSON.stringify(cardCounts)),
      },
    }));
  };

  const goToRound = (index) => {
    saveRound();
    setRoundIndex(index);
  };

  const calculateTotalScores = () => {
    const totals = {};
    for (const round of Object.values(roundStates)) {
      for (const player of playerNames) {
        totals[player] = (totals[player] || 0) + (round.scores?.[player] || 0);
      }
    }
    return totals;
  };

  const totalScores = calculateTotalScores();

  return (
    <>
      <div className="total-scores-tab">
        <h4>Total Scores</h4>
        {playerNames.map(name => (
          <div key={name} className="score">
            {name}: {totalScores[name] || 0}
          </div>
        ))}
      </div>

      <div className="game-page">
        <CardCounter cardCounts={cardCounts} />
        <button className="back" onClick={goHome}>← Home</button>
        <h2>{currentRound}</h2>

        <PlayerInput
          mode={mode}
          scores={scores}
          setScores={setScores}
          cardCounts={cardCounts}
          setCardCounts={setCardCounts}
          playerNames={playerNames}
        />

        <div className="bottom-buttons">
          <button onClick={() => roundIndex > 0 && goToRound(roundIndex - 1)}>Previous Round</button>
          <button className="score-sheet-button" onClick={() => setShowSheet(true)}>Score Sheet</button>
          <button onClick={() => roundIndex < roundNames.length - 1 && goToRound(roundIndex + 1)}>Next Round</button>
        </div>

        {showSheet && (
          <ScoreSheet
            rounds={roundStates}
            players={playerNames}
            onClose={() => setShowSheet(false)}
          />
        )}
      </div>
    </>
  );
}

export default GamePage;
