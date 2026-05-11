import Link from 'next/link';
import Image from 'next/image';
import { FiImage } from 'react-icons/fi';
import styles from './index.module.css';
import { formatDate } from '@/utils/helpers';
import CapacityBar from '@/components/events/CapacityBar';
import LikeButton from '@/components/ui/LikeButton';


export default function EventCard({ event, linkHref }) {
  const { id, title, photo, category, location, start_at, capacity, booked } = event;
  const href = linkHref ?? `/attendee/events/${id}`;

  return (
    <Link href={href} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.photoWrap}>
          {photo ? (
            <Image src={photo} alt={title} fill sizes="100vw" className={styles.photo} />
          ) : (
            <div className={styles.photoPlaceholder} aria-hidden="true">
              <FiImage />
            </div>
          )}
          {category && <span className={styles.categoryBadge}>{category}</span>}
          <div className={styles.likeOverlay}>
            <LikeButton eventId={id} size="sm" />
          </div>
        </div>

        <div className={styles.eventCardContent}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.meta}>
            <span>{formatDate(start_at)}</span>
            <span className={styles.dot}>·</span>
            <span>{location}</span>
          </div>
          <CapacityBar capacity={capacity} booked={booked} />
        </div>
      </article>
    </Link>
  );
}
