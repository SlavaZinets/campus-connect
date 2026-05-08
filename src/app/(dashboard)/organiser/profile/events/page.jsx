import Link from 'next/link';
import OwnerEventCard from '@/components/events/OwnerEventCard';
import EmptyState from '@/components/profile/EmptyState';
import { getEventsByIds, MOCK_OWN_EVENT_IDS } from '@/lib/mock/events';
import styles from './page.module.css';

export default function OrganiserCreatedEventsPage() {
  // TODO: GET /api/events/mine — events created by the caller
  const ownEvents = getEventsByIds(MOCK_OWN_EVENT_IDS);

  if (ownEvents.length === 0) {
    return (
      <EmptyState
        message="You haven't created any events yet."
        ctaHref="/organiser/events/new"
        ctaLabel="Create your first event"
      />
    );
  }

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>Created events</h2>
        <Link href="/organiser/events/new" className={styles.newBtn}>
          <span className="material-symbols-outlined" aria-hidden="true">add</span>
          New event
        </Link>
      </header>

      <div className={styles.grid}>
        {ownEvents.map(event => (
          <OwnerEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
