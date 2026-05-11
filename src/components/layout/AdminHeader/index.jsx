'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoMdClose } from 'react-icons/io';
import Logo from '@/components/ui/Logo';
import styles from './style.module.css';

const NAV_LINKS = [
    { href: '/',              label: 'Home' },
    { href: '/admin/users',   label: 'Users' },
    { href: '/admin/events',  label: 'Events' },
    { href: '/admin/bookings', label: 'Bookings' },
];

export default function AdminHeader() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    async function handleSignOut() {
        await fetch('/api/auth/logout', { method: 'POST' });
        handleClose();
        router.push('/');
        router.refresh();
    }

    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.inner}>
                    <Logo />

                    <nav className={styles.desktopNav}>
                        <ul className={styles.desktopList}>
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className={styles.desktopLink}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.desktopActions}>
                            <Link href="/admin" className={styles.linkSecondary}>
                                Dashboard
                            </Link>
                            <button type="button" onClick={handleSignOut} className={styles.linkSecondary}>
                                Sign out
                            </button>
                        </div>
                    </nav>

                    <button className={styles.hamburger} onClick={handleOpen} aria-label="Open menu">
                        <RxHamburgerMenu size={24} />
                    </button>
                </div>

                <div
                    className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
                    onClick={handleClose}
                />

                <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
                    <div className={styles.sidebarHeader}>
                        <span className={styles.sidebarTitle}>Admin</span>
                        <button className={styles.closeButton} onClick={handleClose} aria-label="Close menu">
                            <IoMdClose size={24} />
                        </button>
                    </div>

                    <nav>
                        <ul className={styles.sidebarList}>
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={styles.sidebarLink}
                                        onClick={handleClose}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.sidebarFooter}>
                        <Link href="/admin" className={styles.linkSecondary} onClick={handleClose}>
                            Dashboard
                        </Link>
                        <button type="button" onClick={handleSignOut} className={styles.linkSecondary}>
                            Sign out
                        </button>
                    </div>
                </aside>
            </div>
        </header>
    );
}
