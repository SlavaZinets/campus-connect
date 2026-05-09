'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import BackButton from '@/components/ui/BackButton';
import PrimaryButton from '@/components/ui/PrimaryButton';
import styles from './style.module.css';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('attendee');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <div className={styles.screen}>
            <div className={styles.topBar}>
                <BackButton />
            </div>

            <div className={styles.content}>
                <div className={styles.logoWrap}>
                    <Logo />
                </div>

                <div className={styles.heading}>
                    <h1 className={styles.title}>Create an account</h1>
                    <p className={styles.subtitle}>Join the campus community</p>
                </div>

                {error && <p className={styles.errorBanner}>{error}</p>}

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <div className={styles.field}>
                        <label htmlFor="name" className={styles.label}>Full name</label>
                        <input
                            id="name"
                            type="text"
                            className={styles.input}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Name Surname"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>Email address</label>
                        <input
                            id="email"
                            type="email"
                            className={styles.input}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="name.surname@student.griffith.ie"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            id="password"
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="* * * * * * * *"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="confirmPassword" className={styles.label}>Confirm password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className={styles.input}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="* * * * * * * *"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="role" className={styles.label}>I am a…</label>
                        <div className={styles.selectWrap}>
                            <select
                                id="role"
                                className={`${styles.input} ${styles.select}`}
                                value={role}
                                onChange={e => setRole(e.target.value)}
                            >
                                <option value="attendee">Student / Attendee</option>
                                <option value="organiser">Event Organiser</option>
                            </select>
                            <span className={styles.selectArrow} aria-hidden="true">▾</span>
                        </div>
                    </div>

                    <PrimaryButton type="submit" disabled={loading} className={styles.submitBtn}>
                        {loading ? 'Creating account...' : 'Create account'}
                    </PrimaryButton>
                </form>

                <p className={styles.switchText}>
                    Already have an account?{' '}
                    <Link href="/login" className={styles.switchLink}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
