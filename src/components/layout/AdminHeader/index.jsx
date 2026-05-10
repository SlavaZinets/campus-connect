import Logo from '@/components/ui/Logo';
import styles from './style.module.css';

export default function AdminHeader() {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.inner}>
          <Logo />
        </div>
      </div>
    </header>
  );
}
