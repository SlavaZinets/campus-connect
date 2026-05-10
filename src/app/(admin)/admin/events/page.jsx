import BackButton from '@/components/ui/BackButton';
import styles from './page.module.css';

export default function AdminEventsPage() {
  return (
    <main className={`container ${styles.page}`}>
      <BackButton label="Back to dashboard" />
      <h1 className={styles.title}>Events</h1>
      <p className={styles.description}>
        Coming soon — this page will list every event on the platform with edit and delete actions.
      </p>
    </main>
  );
}
