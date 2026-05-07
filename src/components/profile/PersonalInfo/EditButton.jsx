'use client';

import styles from './index.module.css';

export default function EditButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} className={styles.editBtn}>
      <span className="material-symbols-outlined" aria-hidden="true">edit</span>
      <span>Edit</span>
    </button>
  );
}
