import Link from 'next/link';
import styles from './index.module.css';

export default function EmptyState({ message, ctaHref, ctaLabel }) {
  return (
    <div className={styles.empty}>
      <p className={styles.message}>{message}</p>
      {ctaHref && ctaLabel && (
        <Link href={ctaHref} className={styles.cta}>
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
