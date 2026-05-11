import { cookies } from 'next/headers';
import AttendeeEventCard from '@/components/events/AttendeeEventCard';
import EmptyState from '@/components/profile/EmptyState';
import styles from './page.module.css';

export default async function BookedEventsPage() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings`);

  if (!res.ok) {
    throw new Error(`GET /api/bookings failed: ${res.status}`);
  }

  // Each row carries booking_id + the joined event fields the card needs.
  const bookings = await res.json();

  if (bookings.length === 0) {
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
        {bookings?.map(b => (
          <AttendeeEventCard
            key={b.booking_id}
            event={b}
            linkHref={`/attendee/bookings/${b.booking_id}`}
          />
        ))}
      </div>
    </section>
  );
}
