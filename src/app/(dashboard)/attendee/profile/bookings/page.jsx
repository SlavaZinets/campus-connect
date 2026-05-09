import EventCard from '@/components/events/EventCard';
import EmptyState from '@/components/profile/EmptyState';
import { getEventsByIds, MOCK_BOOKED_EVENT_IDS } from '@/lib/mock/events';
import styles from './page.module.css';

export default function BookedEventsPage() {
  // TODO: replace with `SELECT events.* FROM bookings JOIN events ... WHERE user_id = ?`
  const bookedEvents = getEventsByIds(MOCK_BOOKED_EVENT_IDS);

  if (bookedEvents.length === 0) {
    return (
      <EmptyState
        message="You haven't booked any events yet."
        ctaHref="/attendee/events"
        ctaLabel="Browse events"
      />
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Booked events</h2>
      <div className={styles.grid}>
        {bookedEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            linkHref={`/attendee/bookings/${event.id}`}
          />
        ))}
      </div>
    </section>
  );
}
