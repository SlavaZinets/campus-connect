import Link from 'next/link';
import styles from './style.module.css';

export default function PrimaryButton({
    href,
    disabled = false,
    onClick,
    children,
}) {

    if (href) {
        return (
            <Link href={href} className={styles.btn}>
                {children}
            </Link>
        );
    }

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={styles.btn}
        >
            {children}
        </button>
    );
}
