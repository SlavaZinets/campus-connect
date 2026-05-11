import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import EventForm from '@/components/events/EventForm';
import styles from './page.module.css';


export default async function EditEventPage({ params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session) redirect('/login');

  const base = process.env.NEXT_PUBLIC_BASE_URL;

  const eventRes = await fetch(`${base}/api/events/${id}`);
  if (eventRes.status === 404) notFound();
  if (!eventRes.ok) throw new Error(`Failed to fetch event: ${eventRes.status}`);
  const event = await eventRes.json();

  if (session.role !== 'admin' && event.organiser_id !== session.id) {
    redirect('/organiser/events');
  }

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const initialValues = {
    id: event.id,
    title: event.title ?? '',
    description: event.description ?? '',
    category: event.category ?? '',
    location: event.location ?? '',
    start_at: formatDateForInput(event.start_at),
    end_at: formatDateForInput(event.end_at),
    capacity: event.capacity ?? '',
    photo: event.photo ?? null,
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
