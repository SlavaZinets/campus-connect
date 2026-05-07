import { CURRENT_USER } from '@/lib/mock/currentUser';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import styles from './layout.module.css';

export default function ProfileLayout({ children }) {
  const user = CURRENT_USER;

  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.topRow}>
          <h1 className={styles.greeting}>Hello, {user.firstName}</h1>
          <ProfileTabs />
        </header>

        <div className={styles.divider} />

        <div className={styles.layout}>
          <ProfileSidebar user={user} />
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </main>
  );
}
