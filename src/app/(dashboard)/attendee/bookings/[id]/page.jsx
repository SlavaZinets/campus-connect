import { notFound } from 'next/navigation';
import BookingDetail from '@/components/bookings/BookingDetail';
import { getEventById } from '@/lib/mock/events';

export default async function BookingDetailPage({ params }) {
  const { id } = await params;

  // TODO: GET /api/bookings/[id]  — verify the booking belongs to the caller
  const event = getEventById(id);
  if (!event) notFound();

  return <BookingDetail event={event} />;
}
