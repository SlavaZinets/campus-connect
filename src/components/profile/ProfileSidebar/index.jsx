import ProfileAvatar from './ProfileAvatar';
import SignOutButton from './SignOutButton';
import styles from './index.module.css';

export default function ProfileSidebar({ user, initialAvatar }) {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <aside className={styles.sidebar}>
      <ProfileAvatar userId={user.id} initialAvatar={initialAvatar} />
      <p className={styles.name}>{fullName}</p>
      <p className={styles.email}>{user.email}</p>
      <SignOutButton />
    </aside>
  );
}
