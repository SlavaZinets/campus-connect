'use client';

import { useState, useEffect } from 'react';
import EventCard from '@/components/admin/EventCard';
import EventEditModal from '@/components/admin/EventEditModal';
import styles from './index.module.css';

export default function EventsList({ categories }) {
    const [events, setEvents] = useState(null);
    const [selected, setSelected] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        fetch('/api/events')
            .then(res => res.ok ? res.json() : [])
            .then(data => { if (!cancelled) setEvents(Array.isArray(data) ? data : []); })
            .catch(() => { if (!cancelled) setEvents(prev => prev ?? []); });
        return () => { cancelled = true; };
    }, [refreshKey]);

    function handleClose() { setSelected(null); }
    function handleRefresh() { handleClose(); setRefreshKey(k => k + 1); }

    if (events === null) return <p className={styles.empty}>Loading…</p>;
    if (events.length === 0) return <p className={styles.empty}>No events yet.</p>;

    return (
        <>
            <div className={styles.grid}>
                {events.map((e) => (
                    <EventCard key={e.id} event={e} onClick={() => setSelected(e)} />
                ))}
            </div>

            {selected && (
                <EventEditModal
                    key={selected.id}
                    event={selected}
                    categories={categories}
                    open={!!selected}
                    onClose={handleClose}
                    onSaved={handleRefresh}
                    onDeleted={handleRefresh}
                />
            )}
        </>
    );
}
