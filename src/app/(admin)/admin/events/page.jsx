import BackButton from '@/components/ui/BackButton';
import EventsList from '@/components/admin/EventsList';
import styles from './page.module.css';

export default async function AdminEventsPage() {

    const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`);
    if (!categoriesRes.ok) {
        throw new Error('Failed to load categories');
    }
    const categories = await categoriesRes.json();

    return (
        <main className={`container ${styles.page}`}>
            <BackButton label="Back to dashboard" />
            <div className={styles.header}>
                <h1 className={styles.title}>Events</h1>
                <p className={styles.description}>
                    All events on the platform. Click a card to edit details or remove an event.
                </p>
            </div>
            <EventsList categories={categories} />
        </main>
    );
}
