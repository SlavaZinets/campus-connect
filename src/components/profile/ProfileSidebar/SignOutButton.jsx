'use client';

import { useRouter } from 'next/navigation';
import styles from './index.module.css';

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <button type="button" onClick={handleSignOut} className={styles.signOut}>
      Sign out
    </button>
  );
}
