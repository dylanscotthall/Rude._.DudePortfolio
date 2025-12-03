"use client";
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ReactNode } from 'react';
import { JSX } from 'react';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  const pathname = usePathname();
  const isMapPage = pathname === '/map';

  const bodyClassName = `${styles.body} ${isMapPage ? styles.mapPage : ''}`;

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" rel="stylesheet"></link>
      </head>
      <body className={bodyClassName}>
        <Navbar />
        <main className={styles.main}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
