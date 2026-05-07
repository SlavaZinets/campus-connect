import SignOutButton from './SignOutButton';
import styles from './index.module.css';

export default function ProfileSidebar({ user }) {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.avatar} aria-hidden="true">
        <span className="material-symbols-outlined">account_circle</span>
      </div>
      <p className={styles.name}>{fullName}</p>
      <p className={styles.email}>{user.email}</p>
      <SignOutButton />
    </aside>
  );
}
