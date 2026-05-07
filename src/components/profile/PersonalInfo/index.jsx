import EditButton from './EditButton';
import styles from './index.module.css';

export default function PersonalInfo({ user }) {
  const fields = [
    { label: 'Name',          value: user.firstName },
    { label: 'Last Name',     value: user.lastName },
    { label: 'Email address', value: user.email },
    { label: 'Phone number',  value: user.phone },
    { label: 'Date of birth', value: user.dateOfBirth },
  ];

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>Personal information</h2>
        <EditButton />
      </header>

      <div className={styles.grid}>
        {fields.map(field => (
          <div key={field.label} className={styles.field}>
            <p className={styles.label}>{field.label}</p>
            <p className={styles.value}>{field.value || '—'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
