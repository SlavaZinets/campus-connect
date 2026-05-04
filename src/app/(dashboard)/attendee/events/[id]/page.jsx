import EventDetail from '@/components/events/EventDetail';
import eventPhoto from '@/assets/event-pics/event1.jpg';

// TODO: replace with real DB fetch once lib/db.js is ready
const MOCK_EVENT = {
  id: 1,
  title: 'Spring Hackathon 2026',
  category: 'Technology',
  location: 'Block D, Room 12',
  start_at: '2026-05-10T14:00:00',
  capacity: 50,
  booked: 38,
  description: 'Join us for a 12-hour hackathon where teams of up to 4 students compete to build innovative solutions to real campus problems. Mentors from industry will be on hand throughout the day. Food and refreshments provided.',
  organiser: 'Computer Science Society',
  photo: eventPhoto,
};

export default async function EventDetailPage({ params }) {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${params.id}`);
  // const event = await res.json();

  const event = MOCK_EVENT;

  return (
    <main>
      <div className="container">
        <EventDetail event={event} />
      </div>
    </main>
  );
}
