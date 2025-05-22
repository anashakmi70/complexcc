import React, { useState } from 'react';
import DoublePopup from './DoublePopup';
import './PlayerInput.css';

const cardTypes = ['l6oosh', 'diamonds', 'queens', 'kings'];

function PlayerInput({ mode, scores, setScores, rounds, setRounds, cardCounts, setCardCounts, playerNames }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleCard = (type, player, operation) => {
    // Only allow remove if there's something to remove
    if (operation === 'remove' && (type === 'l6oosh' || type === 'diamonds')) {
      if (cardCounts[type] <= 0) return;
    }

    if ((type === 'queens' || type === 'kings') && operation === 'add') {
      setSelectedCard(type);
      setSelectedPlayer(player);
    } else {
      updateScore(type, player, operation);
    }
  };

  const updateScore = (type, player, operation, doubled = false, dealer = null) => {
    const newScores = { ...scores };
    const modifier = operation === 'remove' ? -1 : 1;

    let actualDoubled = doubled;
    let actualDealer = dealer;

    if ((type === 'queens' || type === 'kings') && operation === 'remove') {
      const existing = cardCounts[type].find(c => c.player === player);
      if (!existing) return; // Don't remove if not found
      actualDoubled = existing.doubled;
      actualDealer = existing.dealer;
    }

    const points = getPoints(type, actualDoubled, player, actualDealer);

    newScores[player] = (newScores[player] || 0) + (points[player] || 0) * modifier;

    if (actualDoubled && actualDealer && actualDealer !== player) {
      newScores[actualDealer] = (newScores[actualDealer] || 0) + (points[actualDealer] || 0) * modifier;
    }

    const newCounts = { ...cardCounts };

    if (type === 'l6oosh' || type === 'diamonds') {
      newCounts[type] = Math.max(0, newCounts[type] + modifier);
    } else {
      const cardList = [...newCounts[type]];
      if (operation === 'add') {
        cardList.push({ player, doubled, dealer });
      } else {
        const idx = cardList.findIndex(c => c.player === player);
        if (idx !== -1) cardList.splice(idx, 1);
      }
      newCounts[type] = cardList;
    }

    setScores(newScores);
    setCardCounts(newCounts);
    setSelectedCard(null);
    setSelectedPlayer(null);
  };

  const getPoints = (type, doubled, eater, dealer) => {
    const base = {
      l6oosh: -15,
      diamonds: -10,
      queens: doubled ? -50 : -25,
      kings: doubled ? -150 : -75,
    };
    const dealerBonus = {
      queens: 25,
      kings: 75,
    };
    const points = { [eater]: base[type] };
    if (doubled && dealer && dealer !== eater) {
      points[dealer] = dealerBonus[type];
    }
    return points;
  };

  const renderButtons = (player) => (
    <div className="button-grid">
      {cardTypes.map(type => (
        <div className="button-grid-row" key={type}>
          <button onClick={() => handleCard(type, player, 'remove')}>− {type}</button>
          <button onClick={() => handleCard(type, player, 'add')}>+ {type}</button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="player-grid">
      {playerNames.map((player, index) => (
        <div key={index} className="player-box">
          <h3>{player}</h3>
          {renderButtons(player)}
          <p>Total: {scores[player] || 0}</p>
        </div>
      ))}
      {selectedCard && (
        <DoublePopup
          type={selectedCard}
          player={selectedPlayer}
          players={playerNames}
          onSubmit={(doubled, dealer) =>
            updateScore(selectedCard, selectedPlayer, 'add', doubled, dealer)
          }
          onClose={() => {
            setSelectedCard(null);
            setSelectedPlayer(null);
          }}
        />
      )}
    </div>
  );
}

export default PlayerInput;
