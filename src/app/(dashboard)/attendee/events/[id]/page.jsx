import EventDetail from '@/components/events/EventDetail';
import eventPhoto from '@/assets/event-pics/event1.jpg';

// TODO: replace with real DB fetch once lib/db.js is ready
const MOCK_EVENT = {
  id: 1,
  title: 'Spring Hackathon 2026',
  category: 'Technology',
  location: 'Block D, Room 12',
  start_at: '2026-05-10T14:00:00',
  end_at: '2026-05-10T18:00:00',
  capacity: 50,
  booked: 38,
  description: 'Join us for a 12-hour hackathon where teams of up to 4 students compete to build innovative solutions to real campus problems. Mentors from industry will be on hand throughout the day. Food and refreshments provided.',
  organiser: 'Computer Science Society',
  photo: eventPhoto,
  lat: 53.3438,
  lng: -6.2546,
};

// TODO: replace with a real "similar events" query (same category, future date, exclude self)
const MOCK_SIMILAR_EVENTS = [
  {
    id: 4,
    title: 'Intro to Machine Learning',
    category: 'Technology',
    location: 'Block A, Lecture Hall 1',
    start_at: '2026-05-20T13:00:00',
    capacity: 80,
    booked: 61,
    photo: eventPhoto,
  },
  {
    id: 3,
    title: 'CV & LinkedIn Workshop',
    category: 'Career',
    location: 'Library, Seminar Room 2',
    start_at: '2026-05-17T10:00:00',
    capacity: 30,
    booked: 8,
    photo: eventPhoto,
  },
  {
    id: 6,
    title: 'Mindfulness & Wellbeing Session',
    category: 'Wellbeing',
    location: 'Sports Centre, Studio B',
    start_at: '2026-06-02T09:00:00',
    capacity: 20,
    booked: 15,
    photo: eventPhoto,
  },
];

export default async function EventDetailPage({ params }) {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${params.id}`);
  // const event = await res.json();

  const event = MOCK_EVENT;
  const similarEvents = MOCK_SIMILAR_EVENTS;

  return (
    <main>
      <div className="container">
        <EventDetail event={event} similarEvents={similarEvents} />
      </div>
    </main>
  );
}
