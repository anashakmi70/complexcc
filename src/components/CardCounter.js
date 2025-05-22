import React from 'react';
import './CardCounter.css';

function CardCounter({ cardCounts }) {
  const l6 = 13 - cardCounts.l6oosh;
  const d = 13 - cardCounts.diamonds;
  const q = 4 - cardCounts.queens.length;
  const k = 1 - cardCounts.kings.length;

  return (
    <div className="card-counter">
  <span className={l6 <= 0 ? 'zero' : ''}>L6oosh: {Math.max(0, l6)}</span> |{' '}
  <span className={d <= 0 ? 'zero' : ''}>Diamonds: {Math.max(0, d)}</span> |{' '}
  <span className={q <= 0 ? 'zero' : ''}>Queens: {Math.max(0, q)}</span> |{' '}
  <span className={k <= 0 ? 'zero' : ''}>Kings: {Math.max(0, k)}</span>
</div>

  );
}

export default CardCounter;
