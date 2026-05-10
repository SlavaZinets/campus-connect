import { formatDate } from '@/utils/helpers';
import styles from './index.module.css';

const STATUS_LABELS = {
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
};

function getInitial(title) {
    return title?.trim()?.charAt(0)?.toUpperCase() || '?';
}

export default function BookingCard({ booking, onClick }) {
    const { title, attendee_name, attendee_email, status, start_at, location } = booking;
    const statusClass = styles[`status_${status}`] ?? styles.status_confirmed;

    return (
        <button className={styles.card} onClick={onClick}>
            <span className={styles.avatar}>{getInitial(title)}</span>
            <div className={styles.body}>
                <span className={styles.title}>{title}</span>
                <span className={styles.attendee}>{attendee_name} | {attendee_email}</span>
                <span className={styles.meta}>
                    <span className={`${styles.statusBadge} ${statusClass}`}>
                        {STATUS_LABELS[status] ?? status}
                    </span>
                    <span className={styles.date}>{formatDate(start_at)}</span>
                </span>
                <span className={styles.location}>{location}</span>
            </div>
        </button>
    );
}
