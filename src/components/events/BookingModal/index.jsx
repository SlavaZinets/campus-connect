'use client';

import Image from 'next/image';
import Modal from '@/components/ui/Modal';
import { formatDay, formatLongDate, formatTimeRange } from '@/utils/helpers';
import styles from './index.module.css';

export default function BookingModal({ event, open, onClose }) {
  const { title, photo, start_at, end_at } = event;

  function handlePurchase() {
    // TODO: POST /api/bookings { event_id: event.id }
    onClose();
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

        <button type="button" onClick={handlePurchase} className={styles.purchaseBtn}>
          Purchase a ticket
        </button>
      </div>
    </Modal>
  );
}
