import { cookies } from 'next/headers';
import BackButton from '@/components/ui/BackButton';
import EventsList from '@/components/admin/EventsList';
import styles from './page.module.css';

export default async function AdminEventsPage() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const base = process.env.NEXT_PUBLIC_BASE_URL;

    const categoriesRes = await fetch(`${base}/api/categories`, {
        headers: { Cookie: cookieHeader },
    });
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];

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
