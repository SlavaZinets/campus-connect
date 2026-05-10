'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { formatDate } from '@/utils/helpers';
import styles from './index.module.css';

const STATUSES = ['confirmed', 'cancelled'];

export default function BookingEditModal({ booking, open, onClose, onSaved, onDeleted }) {
    const [status, setStatus] = useState(booking.status ?? 'confirmed');
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    async function handleSave(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const res = await fetch(`/api/bookings/${booking.booking_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || `Save failed (${res.status})`);
            }
            onSaved?.();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete() {
        setError(null);
        setSubmitting(true);
        try {
            const res = await fetch(`/api/bookings/${booking.booking_id}`, { method: 'DELETE' });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || `Delete failed (${res.status})`);
            }
            onDeleted?.();
        } catch (err) {
            setError(err.message);
            setConfirmingDelete(false);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <form className={styles.form} onSubmit={handleSave}>
                <div className={styles.heading}>
                    <h2 className={styles.title}>Edit booking</h2>
                    <p className={styles.subtitle}>Change the status or remove this booking from the platform.</p>
                </div>

                <dl className={styles.summary}>
                    <div className={styles.summaryRow}>
                        <dt className={styles.summaryLabel}>Event</dt>
                        <dd className={styles.summaryValue}>{booking.title}</dd>
                    </div>
                    <div className={styles.summaryRow}>
                        <dt className={styles.summaryLabel}>Attendee</dt>
                        <dd className={styles.summaryValue}>{booking.attendee_name} ({booking.attendee_email})</dd>
                    </div>
                    <div className={styles.summaryRow}>
                        <dt className={styles.summaryLabel}>Organiser</dt>
                        <dd className={styles.summaryValue}>{booking.organiser}</dd>
                    </div>
                    <div className={styles.summaryRow}>
                        <dt className={styles.summaryLabel}>Starts</dt>
                        <dd className={styles.summaryValue}>{formatDate(booking.start_at)}</dd>
                    </div>
                    <div className={styles.summaryRow}>
                        <dt className={styles.summaryLabel}>Booked</dt>
                        <dd className={styles.summaryValue}>{formatDate(booking.booked_at)}</dd>
                    </div>
                </dl>

                <div className={styles.field}>
                    <label htmlFor={`bk-status-${booking.booking_id}`} className={styles.label}>Status</label>
                    <select
                        id={`bk-status-${booking.booking_id}`}
                        className={styles.input}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                {confirmingDelete ? (
                    <div className={styles.confirmBlock}>
                        <p className={styles.confirmText}>
                            Permanently delete this booking? This can&#39;t be undone.
                        </p>
                        <div className={styles.confirmRow}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={() => setConfirmingDelete(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={handleDelete}
                                disabled={submitting}
                            >
                                {submitting ? 'Deleting…' : 'Yes, delete'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.deleteTrigger}
                            onClick={() => setConfirmingDelete(true)}
                            disabled={submitting}
                        >
                            Delete booking
                        </button>
                        <button type="submit" className={styles.saveBtn} disabled={submitting}>
                            {submitting ? 'Saving…' : 'Save changes'}
                        </button>
                    </div>
                )}
            </form>
        </Modal>
    );
}
