'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import styles from './OwnerCardActions.module.css';

export default function OwnerCardActions({ eventId }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function openConfirm(e) {
    e.preventDefault();
    e.stopPropagation();
    setConfirmOpen(true);
  }

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
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className={styles.row} onClick={(e) => e.stopPropagation()}>
      <Link
        href={`/organiser/events/${eventId}/edit`}
        onClick={(e) => e.stopPropagation()}
        className={styles.iconBtn}
        aria-label="Edit event"
        title="Edit event"
      >
        <span className="material-symbols-outlined" aria-hidden="true">edit</span>
      </Link>

      <button
        type="button"
        onClick={openConfirm}
        className={`${styles.iconBtn} ${styles.deleteBtn}`}
        aria-label="Delete event"
        title="Delete event"
      >
        <span className="material-symbols-outlined" aria-hidden="true">delete</span>
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
