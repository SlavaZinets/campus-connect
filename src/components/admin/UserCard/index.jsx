import styles from './index.module.css';
import {formatDate} from "@/utils/helpers";

const ROLE_LABELS = {
    admin: 'Admin', organiser: 'Organiser', attendee: 'Attendee',
};

function getInitial(name) {
    return name?.trim()?.charAt(0)?.toUpperCase() || '?';
}


export default function UserCard({user, onClick}) {
    const {name, email, role, created_at} = user;
    const roleClass = styles[`role_${role}`] ?? styles.role_attendee;

    return (
        <button className={styles.card} onClick={onClick}>
            <span className={styles.avatar}>{getInitial(name)}</span>
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
