import eventPhoto from '@/assets/event-pics/event1.jpg';

// TODO: replace with API queries once /api/events is wired up.
export const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Spring Hackathon 2026',
    category: 'Technology',
    location: 'Block D, Room 12',
    start_at: '2026-05-10T14:00:00',
    end_at: '2026-05-10T22:00:00',
    capacity: 50,
    booked: 38,
    photo: eventPhoto,
    description: 'Join us for a 12-hour hackathon where teams of up to 4 students compete to build innovative solutions to real campus problems. Mentors from industry will be on hand throughout the day. Food and refreshments provided.',
    organiser: 'Computer Science Society',
    lat: 53.3438,
    lng: -6.2546,
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
    end_at: '2026-05-17T12:00:00',
    capacity: 30,
    booked: 8,
    photo: eventPhoto,
    description: 'A hands-on workshop on building a CV that stands out and a LinkedIn profile that gets noticed by recruiters. Bring your laptop and current CV (if you have one).',
    organiser: 'Careers Office',
    lat: 53.3439,
    lng: -6.2566,
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

// Events created by CURRENT_USER (organiser dashboard data)
export const MOCK_OWN_EVENT_IDS = [1, 4, 5];

// Mock bookers per event — for the organiser's "view bookings" page.
// Real data comes from `GET /api/events/[id]/bookings` joined to users.
export const MOCK_BOOKERS_BY_EVENT_ID = {
  1: [
    { id: 101, booked_at: '2026-04-12T09:23:00', status: 'confirmed', user: { id: 11, name: 'Anya Petrenko' } },
    { id: 102, booked_at: '2026-04-12T11:05:00', status: 'confirmed', user: { id: 12, name: 'Diego Hernandez' } },
    { id: 103, booked_at: '2026-04-13T14:48:00', status: 'confirmed', user: { id: 13, name: 'Priya Singh' } },
    { id: 104, booked_at: '2026-04-15T08:14:00', status: 'cancelled', user: { id: 14, name: 'Liam O\'Connor' } },
    { id: 105, booked_at: '2026-04-17T16:30:00', status: 'confirmed', user: { id: 15, name: 'Mei Tanaka' } },
    { id: 106, booked_at: '2026-04-19T10:02:00', status: 'confirmed', user: { id: 16, name: 'Tomás Silva' } },
  ],
  4: [
    { id: 201, booked_at: '2026-04-20T12:11:00', status: 'confirmed', user: { id: 21, name: 'Alex Carter' } },
    { id: 202, booked_at: '2026-04-21T17:42:00', status: 'confirmed', user: { id: 22, name: 'Sara Holm' } },
    { id: 203, booked_at: '2026-04-22T08:55:00', status: 'confirmed', user: { id: 23, name: 'Hassan Yusuf' } },
  ],
  5: [
    { id: 301, booked_at: '2026-05-01T10:00:00', status: 'confirmed', user: { id: 31, name: 'Olivia Nguyen' } },
    { id: 302, booked_at: '2026-05-02T11:15:00', status: 'confirmed', user: { id: 32, name: 'Marko Petrov' } },
  ],
};

export function getEventsByIds(ids) {
  return ids
    .map(id => MOCK_EVENTS.find(e => e.id === id))
    .filter(Boolean);
}

export function getEventById(id) {
  return MOCK_EVENTS.find(e => e.id === Number(id));
}

export function getBookersByEventId(id) {
  return MOCK_BOOKERS_BY_EVENT_ID[Number(id)] ?? [];
}
