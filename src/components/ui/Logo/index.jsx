import Link from 'next/link';
import styles from './style.module.css';

export default function Logo({onClick, className = '' }) {
  return (
    <Link
      href='/'
      className={`${styles.logo} ${className}`.trim()}
    >
      <span className={styles.mark}><span>CC</span></span>
      <span className={styles.name}>CampusConnect</span>
    </Link>
  );
}
