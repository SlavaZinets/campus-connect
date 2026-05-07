import styles from './index.module.css';

export default function CapacityBar({ capacity, booked }) {
  const pct = capacity > 0 ? Math.min((booked / capacity) * 100, 100) : 0;
  const isFull = booked >= capacity;
  const isAlmost = pct >= 75;

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <div
          className={`${styles.fill} ${isFull ? styles.full : isAlmost ? styles.almost : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={styles.label}>
        {isFull ? 'Fully booked' : `${booked} / ${capacity} spots taken`}
      </span>
    </div>
  );
}
