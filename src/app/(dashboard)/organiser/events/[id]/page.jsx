import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import BackButton from '@/components/ui/BackButton';
import EventOwnerActions from '@/components/events/EventOwnerActions';
import BookersList from '@/components/events/BookersList';
import { formatDay, formatLongDate, formatTimeRange } from '@/utils/helpers';
import styles from './page.module.css';

export default async function ManageEventPage({ params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect('/login');

  const base = process.env.NEXT_PUBLIC_BASE_URL;
  const cookieHeader = (await cookies()).toString();

  const eventRes = await fetch(`${base}/api/events/${id}`);
  if (eventRes.status === 404) notFound();
  if (!eventRes.ok) throw new Error(`Failed to fetch event: ${eventRes.status}`);
  const event = await eventRes.json();

  if (session.role !== 'admin' && event.organiser_id !== session.id) {
    redirect('/organiser/events');
  }

  const bookingsRes = await fetch(`${base}/api/events/${id}/bookings`, {
    headers: { Cookie: cookieHeader },
  });
  if (!bookingsRes.ok) throw new Error(`Failed to fetch bookings: ${bookingsRes.status}`);
  const rawBookings = await bookingsRes.json();

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
        <BackButton label="Back to my events" className={styles.back} />

        <div className={styles.page}>
          {event.photo && (
            <div className={styles.hero}>
              <Image src={event.photo} alt={event.title} fill priority unoptimized className={styles.heroImg} />
            </div>
          )}

          <div className={styles.header}>
            <div className={styles.headerText}>
              {event.category && <span className={styles.chip}>{event.category}</span>}
              <h1 className={styles.title}>{event.title}</h1>
              <p className={styles.byline}>You are the organiser of this event.</p>
            </div>
            <EventOwnerActions eventId={event.id} />
          </div>

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
        </div>
      </div>
    </main>
  );
}
