'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import { formatDay, formatLongDate, formatTimeRange } from '@/utils/helpers';
import styles from './index.module.css';

export default function BookingModal({ event, open, onClose }) {
  const router = useRouter();
  const { id, title, photo, start_at, end_at } = event;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handlePurchase() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: id }),
      });

      if (res.status === 401) {
        setError('You need to log in to book a ticket.');
        setSubmitting(false);
        return;
      }
      if (res.status === 403) {
        setError('Only attendees can book events.');
        setSubmitting(false);
        return;
      }
      if (res.status === 409) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || 'This event is unavailable.');
        setSubmitting(false);
        return;
      }
      if (res.status === 404) {
        setError('Event not found.');
        setSubmitting(false);
        return;
      }
      if (!res.ok) {
        throw new Error(`POST /api/bookings failed: ${res.status}`);
      }

      // Refresh server components so capacity bar reflects the new count, then close.
      onClose();
      router.push('/attendee/profile/bookings');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} ariaLabel={`Book ${title}`}>
      <div className={styles.column}>
        {photo && (
          <div className={styles.photoWrap}>
            <Image src={photo} alt={title} fill className={styles.photo} sizes="480px" />
          </div>
        )}

        <h2 className={styles.title}>{title}</h2>

        <div className={styles.timeBlock}>
          <span className={styles.day}>{formatDay(start_at)}</span>
          <span className={styles.line}>{formatLongDate(start_at)}</span>
          <span className={styles.line}>{formatTimeRange(start_at, end_at)}</span>
        </div>

        <section className={styles.ticketSection}>
          <h3 className={styles.ticketTitle}>Get your ticket</h3>
          <div className={styles.ticketRow}>
            <span className={styles.ticketName}>General admission</span>
            <span className={styles.ticketPrice}>Free</span>
          </div>
        </section>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <button
          type="button"
          onClick={handlePurchase}
          disabled={submitting}
          className={styles.purchaseBtn}
        >
          {submitting ? 'Booking…' : 'Purchase a ticket'}
        </button>
      </div>
    </Modal>
  );
}
