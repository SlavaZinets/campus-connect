'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './index.module.css';

const TABS = [
  { href: '/attendee/profile',          label: 'Personal information' },
  { href: '/attendee/profile/bookings', label: 'Booked events' },
  { href: '/attendee/profile/likes',    label: 'Liked events' },
];

export default function ProfileTabs() {
  const pathname = usePathname();

  return (
    <nav className={styles.tabs} aria-label="Profile sections">
      {TABS.map(tab => {
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
