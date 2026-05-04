'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import styles from './index.module.css';

const CATEGORIES = ['All', 'Technology', 'Social', 'Career', 'Wellbeing', 'Sports'];

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key, value) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={styles.bar}>
      <input
        type="text"
        placeholder="Search events..."
        defaultValue={searchParams.get('search') ?? ''}
        onChange={e => update('search', e.target.value)}
        className={styles.search}
      />

      <select
        defaultValue={searchParams.get('category') ?? ''}
        onChange={e => update('category', e.target.value === 'All' ? '' : e.target.value)}
        className={styles.select}
      >
        {CATEGORIES.map(c => (
          <option key={c} value={c === 'All' ? '' : c}>{c}</option>
        ))}
      </select>

      <input
        type="date"
        defaultValue={searchParams.get('date') ?? ''}
        onChange={e => update('date', e.target.value)}
        className={styles.date}
      />
    </div>
  );
}