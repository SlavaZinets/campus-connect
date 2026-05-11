import Image from 'next/image';
import styles from './index.module.css';
import { formatDay, formatLongDate, formatTimeRange } from '@/utils/helpers';
import CapacityBar from '@/components/events/CapacityBar';
import EventCard from '@/components/events/EventCard';
import BookButton from '@/components/events/BookButton';

export default function EventDetail({ event, similarEvents = [] }) {
  const {
    id,
    title,
    photo,
    category,
    location,
    start_at,
    end_at,
    capacity,
    booked,
    description,
    organiser,
    lat,
    lng,
  } = event;

  const isFull = booked >= capacity;

  const hasCoords = typeof lat === 'number' && typeof lng === 'number';
  const mapSrc = hasCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005}%2C${lat - 0.003}%2C${lng + 0.005}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`
    : null;

  const pinX = 20 + ((id * 37) % 60);
  const pinY = 20 + ((id * 53) % 60);

  return (
    <article className={styles.page}>
      {photo && (
        <div className={styles.hero}>
          <Image src={photo} alt={title} fill priority className={styles.heroImg} />
        </div>
      )}

      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={styles.header}>
            {category && <span className={styles.chip}>{category}</span>}
            <h1 className={styles.title}>{title}</h1>
            {organiser && <p className={styles.byline}>By {organiser}</p>}
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Date and time</h2>
            <div className={styles.dateBlock}>
              <span className={styles.dateDay}>{formatDay(start_at)}</span>
              <span className={styles.dateLine}>{formatLongDate(start_at)}</span>
              <span className={styles.dateLine}>{formatTimeRange(start_at, end_at)}</span>
            </div>
          </section>

          {description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>About this event</h2>
              <p className={styles.description}>{description}</p>
            </section>
          )}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Location</h2>
            <p className={styles.locationName}>{location}</p>
            {mapSrc ? (
              <iframe
                src={mapSrc}
                title={`Map of ${location}`}
                className={styles.mapEmbed}
                loading="lazy"
              />
            ) : (
              <div className={styles.mapPlaceholder} aria-label="Map placeholder">
                <span
                  className={styles.mapPin}
                  style={{ left: `${pinX}%`, top: `${pinY}%` }}
                />
                <span className={styles.mapLabel}>{location}</span>
              </div>
            )}
          </section>

          {organiser && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Organised by</h2>
              <div className={styles.organiserCard}>
                <div className={styles.organiserAvatar} aria-hidden="true">
                  {organiser.charAt(0).toUpperCase()}
                </div>
                <div className={styles.organiserInfo}>
                  <p className={styles.organiserName}>{organiser}</p>
                  <p className={styles.organiserMeta}>Event organiser</p>
                </div>
              </div>
            </section>
          )}

          {similarEvents.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Similar events</h2>
              <div className={styles.similarGrid}>
                {similarEvents.map(e => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.bookingPanel}>
          <div className={styles.panelInner}>
            <p className={styles.panelTitle}>Book a spot</p>
            <CapacityBar capacity={capacity} booked={booked} />
            <BookButton event={event} isFull={isFull} className={styles.bookBtn} />
          </div>
        </aside>
      </div>

      <div className={styles.mobileBar}>
        <div className={styles.mobileBarCapacity}>
          <CapacityBar capacity={capacity} booked={booked} />
        </div>
        <BookButton event={event} isFull={isFull} className={styles.bookBtn} />
      </div>
    </article>
  );
}
