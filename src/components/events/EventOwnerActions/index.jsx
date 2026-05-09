'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import styles from './index.module.css';

/**
 * Edit / Delete buttons for an event the user owns. Delete opens a confirm
 * modal first to prevent accidents.
 */
export default function EventOwnerActions({ eventId }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);

    try {
      const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });

      if (res.status === 401) {
        alert('Your session expired. Please log in again.');
      } else if (res.status === 403) {
        alert('You can only delete events you organise.');
      } else if (!res.ok) {
        throw new Error(`DELETE /api/events/${eventId} failed: ${res.status}`);
      }

      setConfirmOpen(false);
      router.push('/organiser/events');
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className={styles.actions}>
      <Link href={`/organiser/events/${eventId}/edit`} className={styles.editBtn}>
        <span className="material-symbols-outlined" aria-hidden="true">edit</span>
        Edit
      </Link>

      <button type="button" onClick={() => setConfirmOpen(true)} className={styles.deleteBtn}>
        <span className="material-symbols-outlined" aria-hidden="true">delete</span>
        Delete
      </button>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        ariaLabel="Confirm event deletion"
      >
        <div className={styles.confirm}>
          <h2 className={styles.confirmTitle}>Delete this event?</h2>
          <p className={styles.confirmBody}>
            All confirmed bookings will be cancelled and attendees will lose their spot.
            This action cannot be undone.
          </p>
          <div className={styles.confirmActions}>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className={styles.cancelBtn}
            >
              Keep event
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className={styles.confirmDeleteBtn}
            >
              {deleting ? 'Deleting…' : 'Yes, delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
