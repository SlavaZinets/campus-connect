import EventCard from '@/components/events/EventCard';
import EmptyState from '@/components/profile/EmptyState';
import { getEventsByIds, MOCK_LIKED_EVENT_IDS } from '@/lib/mock/events';
import styles from './page.module.css';

export default function LikedEventsPage() {
  // TODO: replace with a real query joining users x event_likes x events
  const likedEvents = getEventsByIds(MOCK_LIKED_EVENT_IDS);

  if (likedEvents.length === 0) {
    return (
      <EmptyState
        message="You haven't liked any events yet."
        ctaHref="/attendee/events"
        ctaLabel="Browse events"
      />
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Liked events</h2>
      <div className={styles.grid}>
        {likedEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
