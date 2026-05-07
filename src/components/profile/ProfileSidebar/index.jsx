import ProfileAvatar from './ProfileAvatar';
import SignOutButton from './SignOutButton';
import styles from './index.module.css';

export default function ProfileSidebar({ user }) {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <aside className={styles.sidebar}>
      <ProfileAvatar userId={user.id} />
      <p className={styles.name}>{fullName}</p>
      <p className={styles.email}>{user.email}</p>
      <SignOutButton />
    </aside>
  );
}
