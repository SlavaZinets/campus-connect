import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import styles from './layout.module.css';

export default async function ProfileLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  

  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.topRow}>
          <h1 className={styles.greeting}>Hello, {user.firstName}</h1>
          <ProfileTabs />
        </header>

        <div className={styles.divider} />

        <div className={styles.layout}>
          <ProfileSidebar user={user} initialAvatar={user.avatar_img} />
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </main>
  );
}
  