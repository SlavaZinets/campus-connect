'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import PrimaryButton from '@/components/ui/PrimaryButton';
import styles from './style.module.css';
import {RxHamburgerMenu} from "react-icons/rx";
import {IoMdClose} from "react-icons/io";

const NAV_LINKS = [
    {href: '/', label: 'Home'},
    {href: '/events', label: 'Events'},
    {href: '/attendee/bookings', label: 'My Bookings'},
];

export default function Header() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => (res.ok ? res.json() : null))
            .then(setUser)
            .catch(() => setUser(null));
    }, []);

    async function handleSignOut() {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        handleClose();
        router.push('/login');
        router.refresh();
    }

    const profileHref = user?.role === 'organiser' ? '/organiser/profile' : '/attendee/profile';
    const firstName = user?.name ? user.name.split(' ')[0] : '';

    return (

        <header className={styles.header}>
            <div className="container">
                <div className={styles.inner}>
                    <Logo/>

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
                            {user ? (
                                <>
                                    <Link href={profileHref} className={styles.linkSecondary}>
                                        {firstName}
                                    </Link>
                                    <button type="button" onClick={handleSignOut} className={styles.linkSecondary}>
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className={styles.linkSecondary}>Log in</Link>
                                    <PrimaryButton href="/register">Sign up</PrimaryButton>
                                </>
                            )}
                        </div>
                    </nav>

                    <button
                        className={styles.hamburger}
                        onClick={handleOpen}
                    >
                        <RxHamburgerMenu size={24} />
                    </button>
                </div>

                <div
                    className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
                    onClick={handleClose}
                />

                <aside
                    className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
                >
                    <div className={styles.sidebarHeader}>
                        <span className={styles.sidebarTitle}>Menu</span>
                        <button
                            className={styles.closeButton}
                            onClick={handleClose}
                        >
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
                        {user ? (
                            <>
                                <Link href={profileHref} className={styles.linkSecondary} onClick={handleClose}>
                                    {firstName}
                                </Link>
                                <button type="button" onClick={handleSignOut} className={styles.linkSecondary}>
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className={styles.linkSecondary} onClick={handleClose}>
                                    Log in
                                </Link>
                                <PrimaryButton href="/register" onClick={handleClose}>
                                    Sign up
                                </PrimaryButton>
                            </>
                        )}
                    </div>
                </aside>
            </div>
        </header>

    );
}
