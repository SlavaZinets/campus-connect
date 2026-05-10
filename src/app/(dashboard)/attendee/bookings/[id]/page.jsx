import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import BookingDetail from '@/components/bookings/BookingDetail';

export default async function BookingDetailPage({ params }) {
  const { id } = await params;

  // Forward the session cookie so the API can verify ownership.
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${id}`, {
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });

  if (res.status === 404) notFound();
  if (!res.ok) {
    throw new Error(`GET /api/bookings/${id} failed: ${res.status}`);
  }

  // The row contains booking_id + status + the joined event fields.
  const booking = await res.json();

  return <BookingDetail event={booking} />;
}
