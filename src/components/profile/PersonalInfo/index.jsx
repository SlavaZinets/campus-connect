'use client';

import { useEffect, useState } from 'react';
import EditButton from './EditButton';
import EditProfileModal from './EditProfileModal';
import styles from './index.module.css';

const STORAGE_KEY = 'campusconnect:profile';

export default function PersonalInfo({ user: initialUser }) {
  // Server-rendered defaults from CURRENT_USER, optionally overridden by edits
  // saved to localStorage. TODO: replace with PATCH /api/users/me round-trip.
  const [user, setUser] = useState(initialUser);
  const [isEditOpen, setEditOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser({ ...initialUser, ...JSON.parse(saved) });
    } catch {
      // localStorage unavailable — silently fall back to the server-side user
    }
  }, [initialUser]);

  function handleSave(updated) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // quota exceeded or storage disabled — ignore
    }
    setUser(updated);
    setEditOpen(false);
  }

  const fields = [
    { label: 'Name',          value: user.firstName },
    { label: 'Last Name',     value: user.lastName },
    { label: 'Email address', value: user.email },
    { label: 'Phone number',  value: user.phone },
    { label: 'Date of birth', value: user.dateOfBirth },
  ];

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>Personal information</h2>
        <EditButton onClick={() => setEditOpen(true)} />
      </header>

      <div className={styles.grid}>
        {fields.map((field) => (
          <div key={field.label} className={styles.field}>
            <p className={styles.label}>{field.label}</p>
            <p className={styles.value}>{field.value || '—'}</p>
          </div>
        ))}
      </div>

      <EditProfileModal
        user={user}
        open={isEditOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
    </section>
  );
}
