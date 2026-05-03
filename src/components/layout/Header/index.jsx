'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import styles from './style.module.css';
import {RxHamburgerMenu} from "react-icons/rx";
import {IoMdClose} from "react-icons/io";

const NAV_LINKS = [
    {href: '/events', label: 'Events'},
    {href: '/attendee/bookings', label: 'My Bookings'},
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);



    return (

        <header className={styles.header}>
            <div className="container">
                <div className={styles.inner}>
                    <Logo onClick={handleClose} />

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
                            <Link href="/login" className={styles.linkSecondary}>Log in</Link>
                            <Link href="/register" className={styles.linkPrimary}>Sign up</Link>
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
                        <Link href="/login" className={styles.linkSecondary} onClick={handleClose}>
                            Log in
                        </Link>
                        <Link href="/register" className={styles.linkPrimary} onClick={handleClose}>
                            Sign up
                        </Link>
                    </div>
                </aside>
            </div>
        </header>

    );
}
