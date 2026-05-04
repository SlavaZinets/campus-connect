import Link from 'next/link';
import Image from 'next/image';
import styles from './index.module.css';
import { formatDate } from '@/utils/helpers';
import CapacityBar from '@/components/events/CapacityBar';


export default function EventCard({ event }) {
  const { id, title, photo, category, location, start_at, capacity, booked } = event;

  return (
    <Link href={`/attendee/events/${id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.top}>
          <span className={styles.badge}>{category}</span>
        </div>

        {photo && (
          <Image src={photo} alt={title} width={0} height={0} sizes="100vw" className={styles.photo} />
        )}

        <h3 className={styles.title}>{title}</h3>

        <div className={styles.meta}>
          <span>{formatDate(start_at)}</span>
          <span className={styles.dot}>·</span>
          <span>{location}</span>
        </div>

        <CapacityBar capacity={capacity} booked={booked} />
      </article>
    </Link>
  );
}
