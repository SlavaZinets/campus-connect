'use client';

import { useState } from 'react';
import BookingModal from '@/components/events/BookingModal';

/**
 * Thin client wrapper around the "Book a spot" button. Owns the modal
 * open/close state so EventDetail can stay a server component.
 */
export default function BookButton({ event, isFull, className }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        disabled={isFull}
        onClick={() => setOpen(true)}
      >
        {isFull ? 'Fully booked' : 'Book a spot'}
      </button>
      <BookingModal event={event} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
