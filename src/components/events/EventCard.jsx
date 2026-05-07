import Link from 'next/link';
import styles from './EventCard.module.css';

function CapacityBar({ capacity, booked }) {
  const pct = capacity > 0 ? Math.min((booked / capacity) * 100, 100) : 0;
  const isFull = booked >= capacity;
  const isAlmost = pct >= 75;

  return (
    <div className={styles.capacityWrap}>
      <div className={styles.bar}>
        <div
          className={`${styles.fill} ${isFull ? styles.full : isAlmost ? styles.almost : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={styles.capacityLabel}>
        {isFull ? 'Fully booked' : `${booked} / ${capacity} spots taken`}
      </span>
    </div>
  );
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventCard({ id, title, category, location, start_at, capacity, booked }) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <span className={styles.badge}>{category}</span>
      </div>

      <h3 className={styles.title}>{title}</h3>

      <div className={styles.meta}>
        <span>{formatDate(start_at)}</span>
        <span className={styles.dot}>·</span>
        <span>{location}</span>
      </div>

      <CapacityBar capacity={capacity} booked={booked} />

      <Link href={`/attendee/events/${id}`} className={styles.link}>
        View details
      </Link>
    </article>
  );
}
