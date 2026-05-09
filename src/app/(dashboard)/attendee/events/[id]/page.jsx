import { notFound } from 'next/navigation';
import EventDetail from '@/components/events/EventDetail';

export default async function EventDetailPage({ params }) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`,
    { cache: 'no-store' }
  );

  if (res.status === 404) notFound();
  if (!res.ok) {
    throw new Error(`Failed to fetch event ${id}: ${res.status}`);
  }

  const event = await res.json();

  // similarEvents — deferred until /api/events/[id]/similar exists.
  return (
    <main>
      <div className="container">
        <EventDetail event={event} similarEvents={[]} />
      </div>
    </main>
  );
}
