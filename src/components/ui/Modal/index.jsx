'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './index.module.css';

export default function Modal({ open, onClose, ariaLabel, children }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    // Lock scroll on BOTH html and body — this codebase uses html { height: 100% }
    // which makes html the scrolling element, so locking body alone is not enough.
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    // Move focus to close button on open
    closeBtnRef.current?.focus();

    return () => { // clean up before rendering
      document.removeEventListener('keydown', onKey);
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  // Lifts the modal's HTML out of the nested location and appends it directly to the <body>
  return createPortal(
    <div className={styles.backdrop}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close dialog"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            close
          </span>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
