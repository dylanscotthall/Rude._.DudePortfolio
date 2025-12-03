'use client';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { JSX } from 'react';
import styles from './DarkmodeToggle.module.css';

interface DarkmodeToggleProps {
    className?: string;
}

export default function DarkmodeToggle({ className = '' }: DarkmodeToggleProps): JSX.Element {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) root.classList.add('dark');
        else root.classList.remove('dark');
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className={`${styles.toggleButton} ${className}`}
        >
            {isDark ? <Moon size={24} className={styles.icon} /> : <Sun size={24} className={styles.icon} />}
        </button>
    );
}
