import { cookies } from 'next/headers';
import BackButton from '@/components/ui/BackButton';
import UsersList from '@/components/admin/UsersList';
import styles from './page.module.css';

export default async function AdminUsersPage() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`);

  if (!res.ok) {
    throw new Error(`GET /api/users failed: ${res.status}`);
  }

  const users = await res.json();

  return (
    <main className={`container ${styles.page}`}>
      <BackButton label="Back to dashboard" />
      <div className={styles.header}>
        <h1 className={styles.title}>Users</h1>
        <p className={styles.description}>
          {users.length} accounts across all roles. Click a card to edit details or remove an account.
        </p>
      </div>
      <UsersList users={users} />
    </main>
  );
}
