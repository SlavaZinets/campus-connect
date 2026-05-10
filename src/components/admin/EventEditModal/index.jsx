'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import styles from './index.module.css';
import {formatDate} from "@/utils/helpers";

export default function EventEditModal({ event, categories, open, onClose, onSaved, onDeleted }) {
    const [title, setTitle] = useState(event.title ?? '');
    const [description, setDescription] = useState(event.description ?? '');
    const [location, setLocation] = useState(event.location ?? '');
    const [categoryId, setCategoryId] = useState(String(event.category_id ?? ''));
    const [startAt, setStartAt] = useState(formatDate(event.start_at));
    const [capacity, setCapacity] = useState(event.capacity ?? '');
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    async function handleSave(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const res = await fetch(`/api/events/${event.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    location,
                    category_id: Number(categoryId),
                    start_at: startAt,
                    capacity: Number(capacity),
                }),
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
            const res = await fetch(`/api/events/${event.id}`, { method: 'DELETE' });
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
                    <h2 className={styles.title}>Edit event</h2>
                    <p className={styles.subtitle}>Update event details or remove it from the platform.</p>
                </div>

                <div className={styles.field}>
                    <label htmlFor={`ev-title-${event.id}`} className={styles.label}>Title</label>
                    <input
                        id={`ev-title-${event.id}`}
                        type="text"
                        className={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor={`ev-desc-${event.id}`} className={styles.label}>Description</label>
                    <textarea
                        id={`ev-desc-${event.id}`}
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor={`ev-location-${event.id}`} className={styles.label}>Location</label>
                    <input
                        id={`ev-location-${event.id}`}
                        type="text"
                        className={styles.input}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label htmlFor={`ev-category-${event.id}`} className={styles.label}>Category</label>
                        <select
                            id={`ev-category-${event.id}`}
                            className={styles.input}
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">Select…</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor={`ev-capacity-${event.id}`} className={styles.label}>Capacity</label>
                        <input
                            id={`ev-capacity-${event.id}`}
                            type="number"
                            min={1}
                            className={styles.input}
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor={`ev-start-${event.id}`} className={styles.label}>Start</label>
                    <input
                        id={`ev-start-${event.id}`}
                        type="datetime-local"
                        className={styles.input}
                        value={startAt}
                        onChange={(e) => setStartAt(e.target.value)}
                        required
                    />
                </div>

                {error && <p className={styles.error} role="alert">{error}</p>}

                {confirmingDelete ? (
                    <div className={styles.confirmBlock}>
                        <p className={styles.confirmText}>
                            Permanently delete this event and all its bookings? This can&#39;t be undone.
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
                            Delete event
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
