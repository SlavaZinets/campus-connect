import {cookies} from 'next/headers';
import {notFound} from 'next/navigation';

import BookingDetail from '@/components/bookings/BookingDetail';

export default async function BookingDetailPage({params}) {

    const {id} = await params;
    const cookieHeader = (await cookies()).toString();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${id}`, {
        headers: { Cookie: cookieHeader },
    });

    if (res.status === 404) notFound();
    if (!res.ok) {
        throw new Error(`GET /api/bookings/${id} failed: ${res.status}`);
    }

    const booking = await res.json();

    return <BookingDetail event={booking}/>;
}
