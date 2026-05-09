import EventCard from '@/components/events/EventCard';
import EmptyState from '@/components/profile/EmptyState';
import { getEventsByIds, MOCK_BOOKED_EVENT_IDS } from '@/lib/mock/events';
import styles from './page.module.css';

export default function OrganiserBookedEventsPage() {
  // TODO: GET /api/bookings — caller's own attendee bookings
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
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
