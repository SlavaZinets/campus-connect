import { cookies } from 'next/headers';
import Link from 'next/link';
import OwnerEventCard from '@/components/events/OwnerEventCard';
import EmptyState from '@/components/profile/EmptyState';
import { getSession } from '@/lib/session';
import styles from './page.module.css';

export default async function OrganiserEventsPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL;

  const eventsRes = await fetch(`${base}/api/events/mine`);
  if (!eventsRes.ok) throw new Error(`Failed to fetch events: ${eventsRes.status}`);
  const ownEvents = await eventsRes.json();

  return (
    <main className={styles.main}>
      <div className="container">
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>My events</h1>
            <p className={styles.subtitle}>
              Events you&#39;ve created. Click a card to manage bookings, edit details, or delete.
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
