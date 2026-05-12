import styles from './layout.module.css';

export default function AttendeeLayout({ children }) {
  return (
    <main className={styles.main}>
      <div className="container">{children}</div>
    </main>
  );
}
