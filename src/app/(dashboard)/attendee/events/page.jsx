import EventCard from '@/components/events/EventCard';
import FilterBar from '@/components/events/FilterBar';
import styles from './page.module.css';
import eventPhoto from '@/assets/event-pics/event1.jpg';

const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Spring Hackathon 2026',
    category: 'Technology',
    location: 'Block D, Room 12',
    start_at: '2026-05-10T14:00:00',
    capacity: 50,
    booked: 38,
    photo: eventPhoto,
  },
  {
    id: 2,
    title: 'Campus Music Night',
    category: 'Social',
    location: 'Student Union Hall',
    start_at: '2026-05-14T19:30:00',
    capacity: 120,
    booked: 120,
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
    id: 5,
    title: 'End of Year BBQ',
    category: 'Social',
    location: 'Campus Courtyard',
    start_at: '2026-05-28T12:00:00',
    capacity: 200,
    booked: 44,
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

export default async function EventsPage({ searchParams }) {
  
  // const params = new URLSearchParams(searchParams);
  // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events?${params}`);
  // const events = await res.json();

  const events = MOCK_EVENTS;

  return (
    <main>
      <div className="container">
        <h1 className={styles.title}>Events</h1>
        <FilterBar />
        <div className={styles.grid}>
          {events.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      </div>
    </main>
  );
}