import { formatDate } from '@/utils/helpers';
import styles from './index.module.css';

function getInitial(title) {
    return title?.trim()?.charAt(0)?.toUpperCase() || '?';
}

export default function EventCard({ event, onClick }) {
    const { title, organiser, category, location, start_at, capacity, booked } = event;

    return (
        <button className={styles.card} onClick={onClick}>
            <span className={styles.avatar}>{getInitial(title)}</span>
            <div className={styles.body}>
                <span className={styles.title}>{title}</span>
                <span className={styles.organiser}>by {organiser}</span>
                <span className={styles.meta}>
                    <span className={styles.categoryBadge}>{category}</span>
                    <span className={styles.date}>{formatDate(start_at)}</span>
                </span>
                <span className={styles.footer}>
                    <span className={styles.location}>{location}</span>
                    <span className={styles.capacity}>{booked ?? 0}/{capacity}</span>
                </span>
            </div>
        </button>
    );
}
