import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getEventById, getBookersByEventId } from '@/lib/mock/events';
import EventOwnerActions from '@/components/events/EventOwnerActions';
import BookersList from '@/components/events/BookersList';
import { formatDay, formatLongDate, formatTimeRange } from '@/utils/helpers';
import styles from './page.module.css';
import { getSession } from '@/lib/session';
import pool from '@/lib/db';


export default async function ManageEventPage({ params }) {
  const { id } = await params;
  const session = await getSession();

  
  if (!session) redirect('/login');

  
  const eventSql = `
    SELECT
      events.*,
      categories.name AS category,
      users.name      AS organiser
    FROM events
    JOIN categories  ON events.category_id  = categories.id
    JOIN users       ON events.organiser_id = users.id
    WHERE events.id = ?
  `;
  const [eventResult] = await pool.query(eventSql, [id]);
  const event = eventResult[0];

  if (!event) notFound();

  
  if (session.role !== 'admin' && event.organiser_id !== session.id) {
    redirect('/organiser/events');
  }

  
  const bookingsSql = `
    SELECT 
      bookings.id,
      bookings.status,
      bookings.booked_at,
      users.name,
      users.email,
      users.avatar_img
    FROM bookings
    JOIN users ON bookings.user_id = users.id
    WHERE bookings.event_id = ?
    ORDER BY bookings.booked_at DESC
  `;
  const [rawBookings] = await pool.query(bookingsSql, [id]);

  
  const bookings = rawBookings.map((b) => ({
    ...b,
    user: {
      name: b.name,
      email: b.email,
      avatar_img: b.avatar_img,
    },
  }));
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  return (
    <main className={styles.main}>
      <div className="container">
        <Link href="/organiser/events" className={styles.back}>
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Back to my events
        </Link>

        <article className={styles.page}>
          {event.photo && (
            <div className={styles.hero}>
              <Image src={event.photo} alt={event.title} fill priority className={styles.heroImg} />
            </div>
          )}

          <header className={styles.header}>
            <div className={styles.headerText}>
              {event.category && <span className={styles.chip}>{event.category}</span>}
              <h1 className={styles.title}>{event.title}</h1>
              <p className={styles.byline}>You are the organiser of this event.</p>
            </div>
            <EventOwnerActions eventId={event.id} />
          </header>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Confirmed</span>
              <span className={styles.statValue}>{confirmedCount}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Cancelled</span>
              <span className={styles.statValue}>{cancelledCount}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Capacity</span>
              <span className={styles.statValue}>{event.capacity}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Spots left</span>
              <span className={styles.statValue}>{Math.max(0, event.capacity - confirmedCount)}</span>
            </div>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Date and time</h2>
            <div className={styles.dateBlock}>
              <span className={styles.dateDay}>{formatDay(event.start_at)}</span>
              <span className={styles.dateLine}>{formatLongDate(event.start_at)}</span>
              <span className={styles.dateLine}>
                {formatTimeRange(event.start_at, event.end_at)}
              </span>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Location</h2>
            <p className={styles.sectionBody}>{event.location}</p>
          </section>

          {event.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>About this event</h2>
              <p className={styles.sectionBody}>{event.description}</p>
            </section>
          )}

          <section className={styles.section}>
            <header className={styles.bookingsHeader}>
              <h2 className={styles.sectionTitle}>Bookings ({bookings.length})</h2>
              {bookings.length > 5 && (
                <Link href={`/organiser/events/${event.id}/bookings`} className={styles.viewAll}>
                  View all
                </Link>
              )}
            </header>
            <BookersList bookings={bookings} limit={5} />
          </section>
        </article>
      </div>
    </main>
  );
}
