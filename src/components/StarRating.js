// src/components/StarRating.js
import React, { useState } from 'react';

export function StarDisplay({ rating = 0, count = null, size = '1rem' }) {
  const rounded = Math.round(rating * 2) / 2; // round to nearest 0.5
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rounded ? 'filled' : ''}`}
            style={{ fontSize: size }}
          >
            ★
          </span>
        ))}
      </div>
      {rating > 0 && (
        <span style={{ fontSize: '0.85rem', color: 'var(--mid)', marginLeft: '4px' }}>
          {rating.toFixed(1)}
          {count !== null && ` (${count})`}
        </span>
      )}
    </div>
  );
}

export function StarPicker({ value = 0, onChange, labels }) {
  const [hover, setHover] = useState(0);

  const defaults = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  const ratingLabels = labels || defaults;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div
        style={{ display: 'flex', gap: '8px' }}
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '2rem',
              color: star <= (hover || value) ? 'var(--star)' : 'var(--border)',
              transition: 'color 0.1s, transform 0.1s',
              transform: star <= (hover || value) ? 'scale(1.15)' : 'scale(1)',
              padding: '0 2px',
            }}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
      </div>
      {(hover || value) > 0 && (
        <span style={{ fontSize: '0.9rem', color: 'var(--green-deep)', fontWeight: '600', fontFamily: 'var(--font-display)' }}>
          {ratingLabels[(hover || value) - 1]}
        </span>
      )}
    </div>
  );
}
