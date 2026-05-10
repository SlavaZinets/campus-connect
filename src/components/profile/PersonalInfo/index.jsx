'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Added for refreshing data
import EditButton from './EditButton';
import EditProfileModal from './EditProfileModal';
import styles from './index.module.css';

export default function PersonalInfo({ user: initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  

  async function handleSave(updatedData) {
    setIsSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

  
      setUser(updatedData);
      setEditOpen(false);
      router.refresh(); 
      
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  const fields = [
    { label: 'First Name',    value: user.firstName },
    { label: 'Last Name',     value: user.lastName },
    { label: 'Email address', value: user.email },
    { label: 'Phone number',  value: user.phone },
    { label: 'Date of birth', value: user.dateOfBirth },
  ];

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>Personal information</h2>
        <EditButton onClick={() => setEditOpen(true)} disabled={isSaving} />
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
        isSaving={isSaving}
      />
    </section>
  );
}