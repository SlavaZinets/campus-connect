'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import styles from './index.module.css';

const ROLES = ['attendee', 'organiser', 'admin'];

export default function UserEditModal({ user, open, onClose, onSaved, onDeleted }) {
  const [name, setName] = useState(user.name ?? '');
  const [email, setEmail] = useState(user.email ?? '');
  const [role, setRole] = useState(user.role ?? 'attendee');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Save failed (${res.status})`);
      }
      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Delete failed (${res.status})`);
      }
      onDeleted?.();
    } catch (err) {
      setError(err.message);
      setConfirmingDelete(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSave}>
        <div className={styles.heading}>
          <h2 className={styles.title}>Edit user</h2>
          <p className={styles.subtitle}>Update details or remove the account.</p>
        </div>

        <div className={styles.field}>
          <label htmlFor={`user-name-${user.id}`} className={styles.label}>Name</label>
          <input
            id={`user-name-${user.id}`}
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`user-email-${user.id}`} className={styles.label}>Email</label>
          <input
            id={`user-email-${user.id}`}
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`user-role-${user.id}`} className={styles.label}>Role</label>
          <select
            id={`user-role-${user.id}`}
            className={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {confirmingDelete ? (
          <div className={styles.confirmBlock}>
            <p className={styles.confirmText}>Permanently delete this account? This can&#39;t be undone.</p>
            <div className={styles.confirmRow}>
              <button
                className={styles.cancelBtn}
                onClick={() => setConfirmingDelete(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.deleteTrigger}
              onClick={() => setConfirmingDelete(true)}
              disabled={submitting}
            >
              Delete account
            </button>
            <button type="submit" className={styles.saveBtn} disabled={submitting}>
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
}
