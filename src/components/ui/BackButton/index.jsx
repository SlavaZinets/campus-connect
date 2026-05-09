'use client';

import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import styles from './style.module.css';

export default function BackButton({ label = 'Back', className = '' }) {
    const router = useRouter();

    return (
        <button
            type="button"
            onClick={() => router.back()}
            className={`${styles.btn} ${className}`.trim()}
            aria-label="Go back to previous page"
        >
            <IoIosArrowBack size={28} aria-hidden="true" />
            <span>{label}</span>
        </button>
    );
}
