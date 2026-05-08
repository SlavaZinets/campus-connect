'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import styles from './OwnerCardActions.module.css';

/**
 * Compact edit + delete icon buttons for the OwnerEventCard footer.
 * Delete opens a confirmation modal. Both buttons stop click propagation
 * so they don't trigger navigation when the card itself is also a link.
 */
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
    // TODO: DELETE /api/events/[id]
    console.log('TODO: delete event', eventId);
    setConfirmOpen(false);
    router.refresh();
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
