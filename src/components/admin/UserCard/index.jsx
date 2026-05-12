import { FiUser } from 'react-icons/fi';
import styles from './index.module.css';
import { formatDate } from '@/utils/helpers';
import Image from "next/image";

const ROLE_LABELS = {
    admin: 'Admin', organiser: 'Organiser', attendee: 'Attendee',
};

export default function UserCard({ user, onClick }) {
    const { name, email, role, avatar_img, created_at } = user;
    const roleClass = styles[`role_${role}`] ?? styles.role_attendee;

    return (
        <button className={styles.card} onClick={onClick}>
            <span className={styles.avatar}>
                {avatar_img ? (
                    <Image src={avatar_img} alt="" fill sizes="48px" unoptimized className={styles.avatarImg} />
                ) : (
                    <FiUser aria-hidden="true" />
                )}
            </span>
            <div className={styles.body}>
                <span className={styles.name}>{name}</span>
                <span className={styles.email}>{email}</span>
                <span className={styles.meta}>
                    <span className={`${styles.roleBadge} ${roleClass}`}>
                        {ROLE_LABELS[role] ?? role}
                    </span>
                    <span className={styles.joined}>Joined {formatDate(created_at)}</span>
                </span>
            </div>
        </button>
    );
}
