// ScoreSheet.js (Rows: rounds, Columns: players)
import React from 'react';
import './ScoreSheet.css';

const roundOrder = [
  'Complex 1.1', 'Complex 1.2', 'Complex 2.1', 'Complex 2.2',
  'Complex 3.1', 'Complex 3.2', 'Complex 4.1', 'Complex 4.2',
];

function ScoreSheet({ rounds, onClose, players }) {
  return (
    <div className="score-sheet-overlay">
      <div className="score-sheet-modal">
        <button className="close-button" onClick={onClose}>Close</button>
        <table>
          <thead>
            <tr>
              <th>Round</th>
              {players.map(player => (
                <th key={player}>{player}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roundOrder.map(round => (
              <tr key={round}>
                <td>{round}</td>
                {players.map(player => (
                  <td key={player}>
                    {(rounds[round] && rounds[round][player] !== undefined)
                      ? rounds[round][player]
                      : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScoreSheet;
