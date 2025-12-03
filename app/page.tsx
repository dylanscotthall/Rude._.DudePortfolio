import Link from 'next/link';
import { JSX } from 'react';
import styles from './page.module.css';

export default function Home(): JSX.Element {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to My Portfolio
        </h1>
        <p className={styles.subtitle}>
          Photography & Videography | Analise DuBose
        </p>
        <Link href="/portfolio" className={styles.button}>
          View Portfolio
        </Link>
      </main>
    </div>
  );
}
