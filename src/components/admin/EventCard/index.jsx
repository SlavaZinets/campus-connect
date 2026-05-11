import { FiImage } from 'react-icons/fi';
import { formatDate } from '@/utils/helpers';
import styles from './index.module.css';
import Image from "next/image";

export default function EventCard({ event, onClick }) {
    const { title, photo, organiser, category, location, start_at, capacity, booked } = event;

    return (
        <button className={styles.card} onClick={onClick}>
            <span className={styles.avatar}>
                {photo ? (
                    <Image src={photo} alt="" className={styles.avatarImg} />
                ) : (
                    <FiImage aria-hidden="true" />
                )}
            </span>
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
