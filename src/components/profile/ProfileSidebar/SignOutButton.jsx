'use client';

import styles from './index.module.css';

export default function SignOutButton() {
  function handleSignOut() {
    // TODO: POST /api/auth/logout, then router.push('/login')
    console.log('TODO: sign out');
  }

  return (
    <button type="button" onClick={handleSignOut} className={styles.signOut}>
      Sign out
    </button>
  );
}
