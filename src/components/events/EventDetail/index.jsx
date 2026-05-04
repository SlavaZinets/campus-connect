import Image from 'next/image';
import styles from './index.module.css';
import { formatDate } from '@/utils/helpers';
import CapacityBar from '@/components/events/CapacityBar';



export default function EventDetail({ event }) {
  const { title, photo, category, location, start_at, capacity, booked, description, organiser } = event;
  const isFull = booked >= capacity;

  return (
    <article className={styles.card}>
      {photo && (
        <div className={styles.photoWrap}>
          <Image src={photo} alt={title} fill className={styles.photo} />
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.top}>
          <span className={styles.badge}>{category}</span>
        </div>

        <h1 className={styles.title}>{title}</h1>

        <div className={styles.meta}>
          <span>{formatDate(start_at)}</span>
          <span className={styles.dot}>·</span>
          <span>{location}</span>
          {organiser && (
            <>
              <span className={styles.dot}>·</span>
              <span>By {organiser}</span>
            </>
          )}
        </div>

        {description && <p className={styles.description}>{description}</p>}

        <CapacityBar capacity={capacity} booked={booked} />

        <button className={styles.bookBtn} disabled={isFull}>
          {isFull ? 'Fully booked' : 'Book a spot'}
        </button>
      </div>
    </article>
  );
}
