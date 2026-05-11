'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import PrimaryButton from '@/components/ui/PrimaryButton';
import styles from './style.module.css';
import {RxHamburgerMenu} from "react-icons/rx";
import {IoMdClose} from "react-icons/io";

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
        router.push('/');
        router.refresh();
    }

    // Role-aware destinations. Defaults to /attendee/* when logged out.
    const eventsHref  = user?.role === 'organiser' ? '/organiser/events'  : '/attendee/events';
    const profileHref = user?.role === 'organiser' ? '/organiser/profile' : '/attendee/profile';

    const navLinks = [
        { href: '/',          label: 'Home' },
        { href: eventsHref,   label: 'Events' },
    ];

    return (

        <header className={styles.header}>
            <div className="container">
                <div className={styles.inner}>
                    <Logo/>

                    <nav className={styles.desktopNav}>
                        <ul className={styles.desktopList}>
                            {navLinks.map((link) => (
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
                                        Profile
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
                            {navLinks.map((link) => (
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
                                    Profile
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
