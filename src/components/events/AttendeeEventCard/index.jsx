import Link from 'next/link';
import Image from 'next/image';
import styles from './index.module.css';
import { formatDate } from '@/utils/helpers';
import CapacityBar from '@/components/events/CapacityBar';


export default function AttendeeEventCard({ event, linkHref }) {
    const { id, title, photo, category, status, location, start_at, capacity, booked } = event;
    const href = linkHref ?? `/attendee/events/${id}`;

    return (
        <Link href={href} className={styles.cardLink}>
            <article className={styles.card}>
                {photo && (
                    <div className={styles.photoWrap}>
                        <Image src={photo} alt={title} fill sizes="100vw" unoptimized className={styles.photo} />
                    </div>
                )}

                <div className={styles.eventCardContent}>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.meta}>
                        <span className={`
                        ${styles.statusBadge} 
                        ${status === 'cancelled' ? styles.status_cancelled : styles.status_confirmed}
                        `}>{status}</span>
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
