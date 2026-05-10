import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import styles from './style.module.css';

const ADMIN_LINKS = [
  { href: '/admin',          label: 'Dashboard' },
  { href: '/admin/users',    label: 'Users' },
  { href: '/admin/events',   label: 'Events' },
  { href: '/admin/bookings', label: 'Bookings' },
];

export default function AdminFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <Logo />
          </div>

          <nav className={styles.column}>
            <h4 className={styles.columnTitle}>Admin</h4>
            <ul className={styles.columnList}>
              {ADMIN_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.columnLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} CampusConnect — Admin
          </p>
        </div>
      </div>
    </footer>
  );
}
