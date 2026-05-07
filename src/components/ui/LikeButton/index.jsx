'use client';

import { useState } from 'react';
import styles from './index.module.css';


export default function LikeButton({ eventId, initialLiked = false, size = 'md' }) {
  const [liked, setLiked] = useState(initialLiked);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    setLiked(prev => !prev);
    // TODO: POST/DELETE /api/events/${eventId}/like
  }

  const label = liked ? 'Remove from saved events' : 'Save event';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={liked}
      title={label}
      className={`${styles.btn} ${styles[size]} ${liked ? styles.liked : ''}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.icon}
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
