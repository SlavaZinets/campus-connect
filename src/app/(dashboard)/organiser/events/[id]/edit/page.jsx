import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventById } from '@/lib/mock/events';
import EventForm from '@/components/events/EventForm';
import styles from './page.module.css';

export default async function EditEventPage({ params }) {
  const { id } = await params;

  // TODO: GET /api/events/[id] and verify session.userId === event.organiser_id
  const event = getEventById(id);
  if (!event) notFound();

  // The form's datetime-local inputs need YYYY-MM-DDTHH:mm (no seconds)
  const initialValues = {
    id: event.id,
    title: event.title ?? '',
    description: event.description ?? '',
    category: event.category ?? '',
    location: event.location ?? '',
    start_at: event.start_at ? event.start_at.slice(0, 16) : '',
    end_at: event.end_at ? event.end_at.slice(0, 16) : '',
    capacity: event.capacity ?? '',
  };

  return (
    <main className={styles.main}>
      <div className="container">
        <Link href={`/organiser/events/${event.id}`} className={styles.back}>
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Back to event
        </Link>
        <EventForm mode="edit" initialValues={initialValues} />
      </div>
    </main>
  );
}
