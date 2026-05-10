import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';
import EventForm from '@/components/events/EventForm';
import styles from './page.module.css';


export default async function EditEventPage({ params }) {
  const { id } = await params;
  const session = await getSession();


  if (!session) redirect('/login');

  const [rows] = await pool.query(
    `SELECT events.*, categories.name AS category_name 
     FROM events 
     LEFT JOIN categories ON events.category_id = categories.id 
     WHERE events.id = ?`,
    [id]
  );

  const event = rows[0];


  if (!event) notFound();


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
    category: event.category_name ?? '', 
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
