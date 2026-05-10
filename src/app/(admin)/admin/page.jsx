import Link from 'next/link';
import styles from './page.module.css';

const ADMIN_SECTIONS = [
  {
    href: '/admin/users',
    title: 'Users',
    description: 'Browse, edit, and remove user accounts',
  },
  {
    href: '/admin/events',
    title: 'Events',
    description: 'Browse and remove every event on the platform',
  },
  {
    href: '/admin/bookings',
    title: 'Bookings',
    description: 'Review and modify attendee bookings',
  },
];

export default function AdminDashboardPage() {
  return (
    <main className={`container ${styles.page}`}>

      <section className={styles.grid}>
        {ADMIN_SECTIONS.map((section) => (
          <Link key={section.href} href={section.href} className={styles.cardLink}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{section.title}</h2>
              <p className={styles.cardDescription}>{section.description}</p>
              <span className={styles.cardCta}>Open</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
