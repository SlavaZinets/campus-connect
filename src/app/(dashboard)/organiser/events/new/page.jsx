import Link from 'next/link';
import EventForm from '@/components/events/EventForm';
import styles from './page.module.css';

export default function NewEventPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <Link href="/organiser/events" className={styles.back}>
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Back to my events
        </Link>
        <EventForm mode="create" />
      </div>
    </main>
  );
}
