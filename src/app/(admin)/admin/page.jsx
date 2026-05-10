import Link from 'next/link';
import styles from './page.module.css';

const ADMIN_SECTIONS = [
  {
    href: '/admin/users',
    title: 'Users',
    description: 'Browse, edit, and remove user accounts across all roles.',
  },
  {
    href: '/admin/events',
    title: 'Events',
    description: 'Oversee every event on the platform and remove ones that violate policy.',
  },
  {
    href: '/admin/bookings',
    title: 'Bookings',
    description: 'Review attendee bookings and clear records when needed.',
  },
];

export default function AdminDashboardPage() {
  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.intro}>
        <h1 className={styles.title}>Admin dashboard</h1>
        <p className={styles.subtitle}>
          Manage users, events, and bookings across CampusConnect.
        </p>
      </header>

      <section className={styles.grid} aria-label="Admin sections">
        {ADMIN_SECTIONS.map((section) => (
          <Link key={section.href} href={section.href} className={styles.cardLink}>
            <article className={styles.card}>
              <h2 className={styles.cardTitle}>{section.title}</h2>
              <p className={styles.cardDescription}>{section.description}</p>
              <span className={styles.cardCta} aria-hidden="true">Open →</span>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
}
