'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserCard from '@/components/admin/UserCard';
import UserEditModal from '@/components/admin/UserEditModal';
import styles from './index.module.css';

export default function UsersList({ users }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  function close() { setSelected(null); }
  function refresh() { close(); router.refresh(); }

  if (!users || users.length === 0) {
    return <p className={styles.empty}>No users yet.</p>;
  }

  return (
    <>
      <div className={styles.grid}>
        {users.map((u) => (
          <UserCard key={u.id} user={u} onClick={() => setSelected(u)} />
        ))}
      </div>

      {selected && (
        <UserEditModal
          key={selected.id}
          user={selected}
          open={!!selected}
          onClose={close}
          onSaved={refresh}
          onDeleted={refresh}
        />
      )}
    </>
  );
}
