import eventPhoto from '@/assets/event-pics/event1.jpg';

// TODO: replace with API queries once /api/events is wired up.
export const MOCK_EVENTS = [
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

export const MOCK_BOOKED_EVENT_IDS = [1, 3];
export const MOCK_LIKED_EVENT_IDS = [2, 4, 6];

export function getEventsByIds(ids) {
  return ids
    .map(id => MOCK_EVENTS.find(e => e.id === id))
    .filter(Boolean);
}
