import Link from 'next/link';
import styles from './style.module.css';
import Logo from "@/components/ui/Logo";

const FOOTER_SECTIONS = [
    {
        title: 'Explore',
        links: [
            {href: '/events', label: 'Browse events'},
        ],
    },
    {
        title: 'Account',
        links: [
            {href: '/login', label: 'Log in'},
            {href: '/register', label: 'Sign up'},
        ],
    },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.top}>
                    <div className={styles.brandBlock}>
                        <Logo/>
                    </div>

                    <nav className={styles.columns}>
                        {FOOTER_SECTIONS.map((section) => (
                            <div key={section.title} className={styles.column}>
                                <h4 className={styles.columnTitle}>{section.title}</h4>
                                <ul className={styles.columnList}>
                                    {section.links.map((link) => (
                                        <li key={link.href}>
                                            <Link href={link.href} className={styles.columnLink}>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copy}>
                        © {year} CampusConnect. Built for SWD Assignment 3.
                    </p>
                    <ul className={styles.legal}>
                        <li><Link href="/privacy" className={styles.legalLink}>Privacy</Link></li>
                        <li><Link href="/terms" className={styles.legalLink}>Terms</Link></li>
                        <li><Link href="/contact" className={styles.legalLink}>Contact</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
