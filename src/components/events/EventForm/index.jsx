'use client';

import { useState, useRef } from 'react';
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

export default function EventForm({ mode = 'create', initialValues }) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(initialValues ?? {}) }));
  

  const [photo, setPhoto] = useState(initialValues?.photo || null);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const categoryId = MOCK_CATEGORIES.find((c) => c.name === form.category)?.id;
    if (!categoryId) {
      setError('Please pick a valid category.');
      setSubmitting(false);
      return;
    }

    const toMysql = (v) => (v ? v.replace('T', ' ') + ':00' : v);

    
    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      category_id: categoryId,
      start_at: toMysql(form.start_at),
      end_at: toMysql(form.end_at), 
      capacity: Number(form.capacity),
      photo: photo, 
    };

    try {
      const url = mode === 'create' ? '/api/events' : `/api/events/${initialValues.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 401) throw new Error('Session expired');
        if (res.status === 403) throw new Error('Permission denied');
        throw new Error(body.error || 'Server error');
      }

      router.push('/organiser/events');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>
        {mode === 'create' ? 'Create new event' : 'Edit event'}
      </h1>

      
      <div className={styles.field}>
        <label className={styles.label}>Event Cover Photo</label>
        <div
          className={styles.photoPreview}
          onClick={() => fileInputRef.current.click()}
        >
          {photo ? (
            <img src={photo} alt="Preview" className={styles.previewImg} />
          ) : (
            <div className={styles.placeholder}>
              <span className="material-symbols-outlined">add_a_photo</span>
              <p>Click to upload a cover image</p>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          hidden
        />
      </div>

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
          placeholder="What's the event about?"
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
        />
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.actions}>
        <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} className={styles.submitBtn}>
          {submitting ? 'Saving...' : mode === 'create' ? 'Create event' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}