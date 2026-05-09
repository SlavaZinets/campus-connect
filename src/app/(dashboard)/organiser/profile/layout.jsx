import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import styles from './layout.module.css';

export default async function OrganiserProfileLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.topRow}>
          <h1 className={styles.greeting}>Hello, {user.firstName}</h1>
        </header>

        <div className={styles.divider} />

        <div className={styles.layout}>
          <ProfileSidebar user={user} />
          <div className={styles.content}>{children}</div>
        </div>

        <Link href="/organiser/events/new" className={styles.fab} aria-label="Create new event">
          <span className="material-symbols-outlined" aria-hidden="true">add</span>
        </Link>
      </div>
    </main>
  );
}
