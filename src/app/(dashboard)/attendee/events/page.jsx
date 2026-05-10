import { Suspense } from 'react';
import EventCard from '@/components/events/EventCard';
import FilterBar from '@/components/events/FilterBar';
import styles from './page.module.css';



export default async function EventsPage({ searchParams }) {
  
  const sp = await searchParams;

  
  
  const params = new URLSearchParams();
  if (sp?.search)   params.set('search', sp.search);
  if (sp?.category) params.set('category', sp.category);
  if (sp?.date)     params.set('date', sp.date);

  const qs = params.toString();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/events${qs ? `?${qs}` : ''}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status}`);
  }
  const events = await res.json();

  return (
    <main>
      <div className="container">
        <h1 className={styles.title}>Events</h1>
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>
        <div className={styles.grid}>
          {events.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      </div>
    </main>
  );
}