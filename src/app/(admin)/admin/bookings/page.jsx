import BackButton from '@/components/ui/BackButton';
import BookingsList from '@/components/admin/BookingsList';
import styles from './page.module.css';

export default function AdminBookingsPage() {
    return (
        <main className={`container ${styles.page}`}>
            <BackButton label="Back to dashboard" />
            <div className={styles.header}>
                <h1 className={styles.title}>Bookings</h1>
                <p className={styles.description}>
                    All bookings on the platform. Click a card to change the status or remove a record
                </p>
            </div>
            <BookingsList />
        </main>
    );
}
