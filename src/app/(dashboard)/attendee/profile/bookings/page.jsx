import { cookies } from 'next/headers';
import EventCard from '@/components/events/EventCard';
import EmptyState from '@/components/profile/EmptyState';
import styles from './page.module.css';

export default async function BookedEventsPage() {
  // Forward the session cookie so /api/bookings can identify the caller.
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });

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
        {bookings.map(b => (
          <EventCard
            key={b.booking_id}
            event={b}
            linkHref={`/attendee/bookings/${b.booking_id}`}
          />
        ))}
      </div>
    </section>
  );
}
