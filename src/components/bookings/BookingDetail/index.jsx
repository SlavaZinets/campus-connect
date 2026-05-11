'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import { formatDay, formatLongDate, formatTimeRange } from '@/utils/helpers';
import styles from './index.module.css';

export default function BookingDetail({ event }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const {
    id,
    title,
    photo,
    category,
    status,
    location,
    start_at,
    end_at,
    description,
    organiser,
    lat,
    lng,
  } = event;



  const hasCoords = typeof lat === 'number' && typeof lng === 'number';
  const mapSrc = hasCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005}%2C${lat - 0.003}%2C${lng + 0.005}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`
    : null;

  const pinX = 20 + ((id * 37) % 60);
  const pinY = 20 + ((id * 53) % 60);

  async function handleBookingUpdate(newStatus) {
    setCancelling(true); 


    try {
      const res = await fetch(`/api/bookings/${event.booking_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }), 
      });

      if (res.status === 401) {
        
        setCancelling(false);
        return;
      }
      if (res.status === 403) {
        const action = newStatus === 'cancelled' ? 'cancel' : 'book';
        
        setCancelling(false);
        return;
      }
      if (!res.ok) {
        throw new Error(`PATCH /api/bookings/${event.booking_id} failed: ${res.status}`);
      }

    } catch (err) {
      console.error('Something went wrong. Please try again.', err);
      setCancelling(false);
    }
    setConfirmOpen(false); 
    setCancelling(false);  
    router.refresh();
  }
  



  return (
    <article>
      <Link href="/attendee/profile/bookings" className={styles.back}>
        <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        Back to bookings
      </Link>

        <div className={styles.layout}>
          {/* LEFT — event information */}
          <div className={styles.content}>
            <header className={styles.header}>
              {category && <span className={styles.chip}>{category}</span>}
              <h1 className={styles.title}>{title}</h1>
              {organiser && <p className={styles.byline}>By {organiser}</p>}
            </header>

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
          </div>

          {/* RIGHT — image + ticket aside */}
          <aside className={styles.sidebar}>
            {photo && (
              <div className={styles.hero}>
                <Image
                  src={photo}
                  alt={title}
                  fill
                  priority
                  className={styles.heroImg}
                />
              </div>
            )}

            {<button
              type="button"
              onClick={() => setTicketOpen(true)}
              className={styles.ticketCard}
              aria-label="View ticket"
            >
              <span className={styles.ticketIcon} aria-hidden="true">
                <span className="material-symbols-outlined">confirmation_number</span>
              </span>
              <span className={styles.ticketCardBody}>
                <span className={styles.ticketCardTitle}>Ticket</span>
                <span className={styles.ticketCardLink}>View ticket</span>
              </span>
            </button>}

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className={styles.cancelBtn}

            >
              {status === 'cancelled' ? 'Book again' : 'Cancel ticket'}

            </button>
          </aside>
        </div>

        {/* View ticket modal */}
        <Modal
          open={ticketOpen}
          onClose={() => setTicketOpen(false)}
          ariaLabel="Your ticket"
        >
          <div className={styles.ticketView}>
            <div className={styles.ticketHero} aria-hidden="true">
              <span className="material-symbols-outlined">confirmation_number</span>
            </div>

            <div className={status === 'cancelled' ? styles.ticketBadgeCancelled : styles.ticketBadge}>
              <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
              {status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
            </div>

            <h2 className={styles.ticketViewTitle}>{title}</h2>

            <div className={styles.ticketDetails}>
              <div className={styles.ticketDetail}>
                <span className={styles.ticketDetailLabel}>Date</span>
                <span className={styles.ticketDetailValue}>
                  {formatDay(start_at)}, {formatLongDate(start_at)}
                </span>
              </div>
              <div className={styles.ticketDetail}>
                <span className={styles.ticketDetailLabel}>Time</span>
                <span className={styles.ticketDetailValue}>{formatTimeRange(start_at, end_at)}</span>
              </div>
              <div className={styles.ticketDetail}>
                <span className={styles.ticketDetailLabel}>Location</span>
                <span className={styles.ticketDetailValue}>{location}</span>
              </div>
              <div className={styles.ticketDetail}>
                <span className={styles.ticketDetailLabel}>Type</span>
                <span className={styles.ticketDetailValue}>General admission</span>
              </div>
              <div className={styles.ticketDetail}>
                <span className={styles.ticketDetailLabel}>Booking ref.</span>
                <span className={styles.ticketDetailValue}>CC-{String(id).padStart(6, '0')}</span>
              </div>
            </div>

            <p className={styles.ticketHint}>Show this page at the door on the day.</p>
          </div>
        </Modal>

        
        <Modal
          open={confirmOpen && status !== 'cancelled'}
          onClose={() => setConfirmOpen(false)}
          ariaLabel="Confirm ticket cancellation"
        >
          <div className={styles.confirm}>
            <h2 className={styles.confirmTitle}>Cancel your ticket?</h2>
            <p className={styles.confirmBody}>
              You&apos;ll lose your spot at this event. You can re-book later if there&apos;s still capacity.
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className={styles.keepBtn}
              >
                Keep ticket
              </button>
              <button
                type="button"
                onClick={() =>  handleBookingUpdate('cancelled')}
                disabled={cancelling}
                className={styles.confirmCancelBtn}
              >
                {cancelling ? 'Cancelling…' : 'Yes, cancel'}
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          open={confirmOpen && status === 'cancelled'}
          onClose={() => setConfirmOpen(false)}
          ariaLabel="Confirm ticket cancellation"
        >
          <div className={styles.confirm}>
            <h2 className={styles.confirmTitle}>Book ticket again?</h2>
            <p className={styles.confirmBody}>
              This will book you a ticket for this event again, if there&apos;s still capacity.
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className={styles.keepBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleBookingUpdate('confirmed')}
                disabled={cancelling}
                className={styles.confirmCancelBtn}
              >
                {cancelling ? 'Cancelling…' : 'Yes, book again'}
              </button>
            </div>
          </div>
      </Modal>
    </article>
  );
}
