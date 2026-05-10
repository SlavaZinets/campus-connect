import pool from '@/lib/db';

import Link from 'next/link';
import OwnerEventCard from '@/components/events/OwnerEventCard';
import EmptyState from '@/components/profile/EmptyState';

import styles from './page.module.css';
import { getSession } from '@/lib/session';

export default async function OrganiserEventsPage() {
  
  const session = await getSession();

  
  if (!session || session.role !== 'organiser') {
    return (
      <main className="container">
        <p>You must be logged in as an organiser to view this page.</p>
      </main>
    );
  }

  
  const [ownEvents] = await pool.query(
    `SELECT 
        events.*, 
        categories.name AS category 
     FROM events 
     LEFT JOIN categories ON events.category_id = categories.id
     WHERE organiser_id = ? 
     ORDER BY created_at DESC`,
    [session.id]
  );

  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>My events</h1>
            <p className={styles.subtitle}>
              Events you've created. Click a card to manage bookings, edit details, or delete.
            </p>
          </div>
          <Link href="/organiser/events/new" className={styles.newBtn}>
            <span className="material-symbols-outlined" aria-hidden="true">add</span>
            New event
          </Link>
        </header>

        {ownEvents.length === 0 ? (
          <EmptyState
            message="You haven't created any events yet."
            ctaHref="/organiser/events/new"
            ctaLabel="Create your first event"
          />
        ) : (
          <div className={styles.grid}>
            {ownEvents.map((event) => (
              <OwnerEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
