import { formatDate } from '@/utils/helpers';
import styles from './index.module.css';

/**
 * Renders bookings as a table. Owners see {name, booked_at, status}; admins
 * could pass extra columns through later.
 *
 * Props:
 *   - bookings: array of { id, booked_at, status, user: { name } }
 *   - limit (optional): only show first N rows
 */
export default function BookersList({ bookings = [], limit }) {
  const rows = limit ? bookings.slice(0, limit) : bookings;
  const truncated = limit ? bookings.length > limit : false;

  if (rows.length === 0) {
    return <p className={styles.empty}>No bookings yet.</p>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Attendee</th>
            <th>Booked</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id}>
              <td className={styles.name}>{b.user?.name ?? '—'}</td>
              <td className={styles.date}>{formatDate(b.booked_at)}</td>
              <td>
                <span className={`${styles.status} ${b.status === 'cancelled' ? styles.statusCancelled : styles.statusConfirmed}`}>
                  {b.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {truncated && (
        <p className={styles.note}>
          Showing first {limit} of {bookings.length} bookings.
        </p>
      )}
    </div>
  );
}
