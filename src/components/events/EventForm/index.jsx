'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_CATEGORIES } from '@/lib/mock/events';
import styles from './index.module.css';

const EMPTY = {
  title: '',
  description: '',
  category: '',
  location: '',
  start_at: '',
  end_at: '',
  capacity: '',
};

/**
 * Used by /organiser/events/new and /organiser/events/[id]/edit.
 * Pass `mode = "create" | "edit"` and (for edit) `initialValues` from the API.
 */
export default function EventForm({ mode = 'create', initialValues }) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(initialValues ?? {}) }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // API expects category_id (number); the form binds category as a name.
    const categoryId = MOCK_CATEGORIES.find((c) => c.name === form.category)?.id;
    if (!categoryId) {
      setError('Please pick a valid category.');
      setSubmitting(false);
      return;
    }

    // datetime-local 'YYYY-MM-DDTHH:mm' -> MySQL 'YYYY-MM-DD HH:mm:ss'
    const toMysql = (v) => (v ? v.replace('T', ' ') + ':00' : v);

    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      category_id: categoryId,
      start_at: toMysql(form.start_at),
      capacity: Number(form.capacity),
    };

    try {
      if (mode === 'create') {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.status === 401) {
          setError('Your session expired. Please log in again.');
          setSubmitting(false);
          return;
        }
        if (res.status === 403) {
          setError('You need to be logged in as an organiser to create events.');
          setSubmitting(false);
          return;
        }
        if (res.status === 400) {
          const body = await res.json().catch(() => ({}));
          setError(body.error || 'Please fill in all required fields.');
          setSubmitting(false);
          return;
        }
        if (!res.ok) {
          throw new Error(`POST /api/events failed: ${res.status}`);
        }
      } else {
        const res = await fetch(`/api/events/${initialValues.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.status === 401) {
          setError('Your session expired. Please log in again.');
          setSubmitting(false);
          return;
        }
        if (res.status === 403) {
          setError('You can only edit events you organise.');
          setSubmitting(false);
          return;
        }
        if (!res.ok) {
          throw new Error(`PUT /api/events/${initialValues.id} failed: ${res.status}`);
        }
      }

      router.push('/organiser/events');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  function handleCancel() {
    router.back();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>
        {mode === 'create' ? 'Create new event' : 'Edit event'}
      </h1>

      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>Event title</label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={update('title')}
          className={styles.input}
          required
          placeholder="e.g. Spring Hackathon 2026"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>Description</label>
        <textarea
          id="description"
          value={form.description}
          onChange={update('description')}
          className={styles.textarea}
          rows={5}
          placeholder="What's the event about? Who should come?"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="category" className={styles.label}>Category</label>
          <select
            id="category"
            value={form.category}
            onChange={update('category')}
            className={styles.input}
            required
          >
            <option value="" disabled>Pick a category</option>
            {MOCK_CATEGORIES.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="location" className={styles.label}>Location</label>
          <input
            id="location"
            type="text"
            value={form.location}
            onChange={update('location')}
            className={styles.input}
            required
            placeholder="Block A, Lecture Hall 1"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="start_at" className={styles.label}>Starts at</label>
          <input
            id="start_at"
            type="datetime-local"
            value={form.start_at}
            onChange={update('start_at')}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="end_at" className={styles.label}>Ends at</label>
          <input
            id="end_at"
            type="datetime-local"
            value={form.end_at}
            onChange={update('end_at')}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="capacity" className={styles.label}>Capacity</label>
        <input
          id="capacity"
          type="number"
          min="1"
          value={form.capacity}
          onChange={update('capacity')}
          className={styles.input}
          required
          placeholder="50"
        />
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.actions}>
        <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} className={styles.submitBtn}>
          {submitting
            ? 'Saving…'
            : mode === 'create' ? 'Create event' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
