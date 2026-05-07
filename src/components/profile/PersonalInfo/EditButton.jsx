'use client';

import styles from './index.module.css';

export default function EditButton() {
  function handleEdit() {
    // TODO: open edit-profile modal / route to /attendee/profile/edit
    console.log('TODO: open edit profile modal');
  }

  return (
    <button type="button" onClick={handleEdit} className={styles.editBtn}>
      <span className="material-symbols-outlined" aria-hidden="true">edit</span>
      <span>Edit</span>
    </button>
  );
}
