import Link from 'next/link';
import Image from 'next/image';
import OwnerCardActions from './OwnerCardActions';
import { formatDate } from '@/utils/helpers';
import styles from './index.module.css';

/**
 * Variant of EventCard for an event the user owns. The photo and the title
 * link to the management view; the actions sit inline next to the title.
 */
export default function OwnerEventCard({ event }) {
  const { id, title, photo, location, start_at, capacity, booked } = event;
  const pct = capacity > 0 ? Math.min((booked / capacity) * 100, 100) : 0;
  const isFull = booked >= capacity;
  const isAlmost = pct >= 75;
  const manageHref = `/organiser/events/${id}`;

  return (
    <article className={styles.card}>
      <Link href={manageHref} className={styles.photoLink} aria-label={title}>
       <div className={styles.photoWrap}>
          {photo ? (
            
            <img 
              src={photo} 
              alt="" 
              className={styles.photo} 
            />
          ) : (
            <div className={styles.photoPlaceholder}>
               <span className="material-symbols-outlined">image</span>
            </div>
          )}
        </div>
      </Link>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <Link href={manageHref} className={styles.titleLink}>
            <h3 className={styles.title}>{title}</h3>
          </Link>
          <OwnerCardActions eventId={id} />
        </div>

        <p className={styles.date}>{formatDate(start_at)}</p>
        <p className={styles.location}>{location}</p>

        <div className={styles.bookedRow}>
          <span className={styles.bookedNumber}>{booked} / {capacity}</span>
          <span className={styles.bookedLabel}>spots booked</span>
        </div>

        <div className={styles.bar}>
          <div
            className={`${styles.barFill} ${isFull ? styles.barFull : isAlmost ? styles.barAlmost : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </article>
  );
}
