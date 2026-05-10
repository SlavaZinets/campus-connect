import BackButton from '@/components/ui/BackButton';
import styles from './page.module.css';

export default function AdminBookingsPage() {
  return (
    <main className={`container ${styles.page}`}>
      <BackButton label="Back to dashboard" />
      <h1 className={styles.title}>Bookings</h1>
      <p className={styles.description}>
        Coming soon — this page will list every booking on the platform with the ability to remove records.
      </p>
    </main>
  );
}
