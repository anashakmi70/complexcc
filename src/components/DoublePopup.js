import React, { useState } from 'react';
import './DoublePopup.css';

function DoublePopup({ type, player, players, onSubmit, onClose }) {
  const [doubled, setDoubled] = useState(false);
  const [dealer, setDealer] = useState('');

  return (
    <div className="double-popup">
      <h3>{type.toUpperCase()} - {player}</h3>
      <label>
        <input type="checkbox" checked={doubled} onChange={e => setDoubled(e.target.checked)} />
        Doubled
      </label>
      {doubled && (
        <select value={dealer} onChange={e => setDealer(e.target.value)}>
          <option value="">No Dealer</option>
          {players.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      )}
      <button onClick={() => onSubmit(doubled, dealer || null)}>Submit</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default DoublePopup;
