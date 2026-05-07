'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';

const STORAGE_KEY = 'campusconnect:avatar';
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB cap to keep localStorage healthy

/**
 * Click the avatar -> opens a hidden file input -> shows the chosen image.
 * Persists the data URL to localStorage so it survives reloads.
 *
 * TODO: replace localStorage with an API call:
 *   await fetch(`/api/users/${userId}/avatar`, { method: 'POST', body: formData })
 */
export default function ProfileAvatar({ userId }) {
  const [src, setSrc] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Read previously saved avatar after mount (localStorage is browser-only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSrc(saved);
    } catch {
      // localStorage might be disabled (private mode / quota) — silently ignore
    }
  }, []);

  function openPicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // reset so picking the same file again still triggers change
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('Image is larger than 2 MB. Please pick a smaller one.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setSrc(dataUrl);
      setError(null);
      try {
        localStorage.setItem(STORAGE_KEY, dataUrl);
      } catch {
        // Quota exceeded — image too big once base64-encoded
        setError('Image is too large to save locally.');
      }
    };
    reader.onerror = () => setError('Could not read that file.');
    reader.readAsDataURL(file);
  }

  return (
    <div className={styles.avatarWrap}>
      <button
        type="button"
        onClick={openPicker}
        className={styles.avatarButton}
        aria-label="Change profile picture"
      >
        {src ? (
          <img src={src} alt="Profile picture" className={styles.avatarImg} />
        ) : (
          <span className="material-symbols-outlined" aria-hidden="true">
            account_circle
          </span>
        )}
        <span className={styles.avatarOverlay} aria-hidden="true">
          Change
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInput}
        aria-hidden="true"
        tabIndex={-1}
      />
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
