import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import styles from './layout.module.css';

export default async function ProfileLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className={styles.layout}>
      <ProfileSidebar user={user} initialAvatar={user.avatar_img} />
      <div>{children}</div>
    </div>
  );
}
