'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './index.module.css';

const ATTENDEE_TABS = [
  { href: '/attendee/profile',          label: 'Personal information' },
  { href: '/attendee/profile/bookings', label: 'Booked events' },
  { href: '/attendee/profile/likes',    label: 'Liked events' },
];

/**
 * Pass a custom `tabs` array (e.g. for organiser/admin profiles) or fall back
 * to the attendee tab set.
 */
export default function ProfileTabs({ tabs = ATTENDEE_TABS }) {
  const pathname = usePathname();

  return (
    <nav className={styles.tabs} aria-label="Profile sections">
      {tabs.map(tab => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
