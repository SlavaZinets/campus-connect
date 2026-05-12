'use client';

import { useState, useEffect, useMemo } from 'react';
import BookingCard from '@/components/admin/BookingCard';
import BookingEditModal from '@/components/admin/BookingEditModal';
import styles from './index.module.css';

export default function BookingsList() {
    const [bookings, setBookings] = useState(null);
    const [selected, setSelected] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [search, setSearch] = useState('');

    useEffect(() => {
        let cancelled = false;
        fetch('/api/bookings')
            .then(res => res.ok ? res.json() : [])
            .then(data => { if (!cancelled) setBookings(Array.isArray(data) ? data : []); })
            .catch(() => { if (!cancelled) setBookings(prev => prev ?? []); });
        return () => { cancelled = true; };
    }, [refreshKey]);

    const filtered = useMemo(() => {
        if (!bookings) return [];
        const q = search.trim().toLowerCase();
        if (!q) return bookings;
        return bookings.filter(b => b.attendee_email?.toLowerCase().includes(q));
    }, [bookings, search]);

    function handleClose() { setSelected(null); }
    function handleRefresh() { handleClose(); setRefreshKey(k => k + 1); }

    if (bookings === null) return <p className={styles.empty}>Loading…</p>;

    return (
        <>
            <div className={styles.toolbar}>
                <input
                    type="search"
                    className={styles.search}
                    placeholder="Search by attendee email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {bookings.length === 0 ? (
                <p className={styles.empty}>No bookings yet.</p>
            ) : filtered.length === 0 ? (
                <p className={styles.empty}>No bookings match “{search}”.</p>
            ) : (
                <div className={styles.grid}>
                    {filtered.map((b) => (
                        <BookingCard
                            key={b.booking_id}
                            booking={b}
                            onClick={() => setSelected(b)}
                        />
                    ))}
                </div>
            )}

            {selected && (
                <BookingEditModal
                    key={selected.booking_id}
                    booking={selected}
                    open={!!selected}
                    onClose={handleClose}
                    onSaved={handleRefresh}
                    onDeleted={handleRefresh}
                />
            )}
        </>
    );
}
