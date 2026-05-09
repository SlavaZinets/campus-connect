'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Logo from '@/components/ui/Logo';
import styles from './style.module.css';
import {IoIosArrowBack} from "react-icons/io";

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
    }

    return (<div className={styles.screen}>
            <div className={styles.topBar}>
                <button
                    onClick={() => router.back()}
                    className={styles.backBtn}
                >
                    <IoIosArrowBack size={28}/>
                    <span>Back</span>
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.logoWrap}>
                    <Logo/>
                </div>

                <div className={styles.heading}>
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.subtitle}>Sign in to your campus account</p>
                </div>

                {error && <p className={styles.errorBanner}>{error}</p>}

                <form onSubmit={handleSubmit} className={styles.form}>
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

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className={styles.switchText}>
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className={styles.switchLink}>Sign up</Link>
                </p>
            </div>
        </div>);
}
