import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventById, getBookersByEventId } from '@/lib/mock/events';
import BookersList from '@/components/events/BookersList';
import styles from './page.module.css';

export default async function EventBookersPage({ params }) {
  const { id } = await params;

  // TODO: GET /api/events/[id]/bookings — owner sees names only (no email/phone)
  const event = getEventById(id);
  if (!event) notFound();

  const bookings = getBookersByEventId(id);
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <main className={styles.main}>
      <div className="container">
        <Link href={`/organiser/events/${event.id}`} className={styles.back}>
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Back to event
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>Bookings — {event.title}</h1>
          <p className={styles.subtitle}>
            {confirmedCount} confirmed · {bookings.length - confirmedCount} cancelled · capacity {event.capacity}
          </p>
        </header>

        <BookersList bookings={bookings} />
      </div>
    </main>
  );
}
