// TODO: replace with getCurrentUser() reading lib/session.js once auth is ready.
export const CURRENT_USER = {
  id: 1,
  firstName: 'Maxim',
  lastName: 'Chechotkin',
  email: 'maxchechotkin@gmail.com',
  phone: '+380964151541',
  dateOfBirth: '2025-06-06',
  // Organiser role inherits all attendee features, so this keeps both areas of
  // the app navigable while auth isn't wired up yet.
  role: 'organiser',
};
