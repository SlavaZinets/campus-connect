'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import styles from './EditProfileModal.module.css';

export default function EditProfileModal({ user, open, onClose, onSave }) {
  // Local form state — copied from the current user every time the modal opens,
  // so cancelling discards any in-progress edits.
  const [form, setForm] = useState(user);

  useEffect(() => {
    if (open) setForm(user);
  }, [open, user]);

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: PATCH /api/users/me with the diff
    onSave(form);
  }

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Edit personal information">
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Edit profile</h2>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="firstName" className={styles.label}>Name</label>
            <input
              id="firstName"
              type="text"
              value={form.firstName ?? ''}
              onChange={update('firstName')}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="lastName" className={styles.label}>Last name</label>
            <input
              id="lastName"
              type="text"
              value={form.lastName ?? ''}
              onChange={update('lastName')}
              className={styles.input}
              required
            />
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label htmlFor="email" className={styles.label}>Email address</label>
            <input
              id="email"
              type="email"
              value={form.email ?? ''}
              onChange={update('email')}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="phone" className={styles.label}>Phone number</label>
            <input
              id="phone"
              type="tel"
              value={form.phone ?? ''}
              onChange={update('phone')}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="dateOfBirth" className={styles.label}>Date of birth</label>
            <input
              id="dateOfBirth"
              type="date"
              value={form.dateOfBirth ?? ''}
              onChange={update('dateOfBirth')}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn}>
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
