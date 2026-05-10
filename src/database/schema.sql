CREATE DATABASE IF NOT EXISTS campusconnect
  CHARACTER SET utf8mb4 /* ensures database handles all characters correctly */
  COLLATE utf8mb4_unicode_ci;

USE campusconnect;

CREATE TABLE IF NOT EXISTS categories (
    id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users(
    id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('attendee', 'organiser', 'admin') NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    avatar_img VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    organiser_id int UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id int UNSIGNED NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_at DATETIME NOT NULL,
    capacity SMALLINT UNSIGNED NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_organiser FOREIGN KEY (organiser_id) REFERENCES users(id),
    CONSTRAINT fk_events_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id int UNSIGNED NOT NULL,
    event_id int UNSIGNED NOT NULL,
    status ENUM('confirmed', 'cancelled') NOT NULL,
    booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_bookings_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT uq_booking UNIQUE (user_id, event_id)
);

CREATE TABLE IF NOT EXISTS sessions (
    id int UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id int UNSIGNED NOT NULL,
    token VARCHAR(255) UNIQUE,
    expires_at DATETIME,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id)
);