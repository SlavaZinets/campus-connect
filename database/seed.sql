USE campusconnect;

INSERT INTO categories (name, slug) VALUES
('Workshop', 'workshop'),
('Social', 'social'),
('Sports', 'sports'),
('Career', 'career');

/* Uses pre-generated bcrypt hash.*/
INSERT INTO users (name, email, password_hash, role) VALUES
('Atrem', 'artem@campus.ie', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Slava', 'slava@campus.ie', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'organiser'),
('Maks', 'maks@campus.ie', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'attendee'),
('John', 'john@campus.ie', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'attendee');

INSERT INTO events (organiser_id, category_id, title, description, location, start_at, capacity) VALUES
(2, 4, 'Creating CV', 'This event will cover everything you need to know to create your first CV', 'Auditorium', '2026-06-10 11:00:00', 100),
(2, 1, 'Photography basics', 'This workshop will help you understand the basics of photography', 'Studio', '2026-06-12 12:00:00', 20),
(2, 2, 'Freshers party', 'A party for our new students', 'Club', '2026-09-04 20:00:00', 120),
(2, 3, 'Football tryouts', 'An opportunity for our students to get into our football team', 'Sports centre', '2026-09-15 09:00:00', 30);

INSERT INTO bookings (user_id, event_id, status) VALUES
(3, 1, 'confirmed'),
(3, 3, 'confirmed'),
(4, 4, 'confirmed'),
(4, 2, 'cancelled');