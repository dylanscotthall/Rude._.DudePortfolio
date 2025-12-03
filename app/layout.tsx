"use client";
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ReactNode, useEffect, useState } from 'react';
import { JSX } from 'react';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';
import MapBackground from './components/MapBackground';
import { ThemeContextType } from './lib/interfaces';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  const pathname = usePathname();
  const isMapPage = pathname === '/map';

  const [isDark, setIsDark] = useState(false);
  const [fillColor, setFillColor] = useState("#c8c3b2");
  const [strokeColor, setStrokeColor] = useState("#ffffff");

  const bodyClassName = `${styles.body} ${isDark ? "dark" : ""}`;

  const toggleDark = () => setIsDark(!isDark);

  useEffect(() => {
    setIsDark(document.body.classList.contains('dark'));
  }, []);
  useEffect(() => {
    console.log(isDark);
    if (isDark) {
      setFillColor("#1c2742ff");
      setStrokeColor("#000000ff");
    } else {
      setFillColor("#c8c3b2");
      setStrokeColor("#ffffff");
    }
  }, [isDark]);

  const theme: ThemeContextType = {
    isDark,
    toggleDark,
    fillColor,
    strokeColor,
    setFillColor,
    setStrokeColor,
  };

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" rel="stylesheet"></link>
      </head>
      <body className={bodyClassName}>
        {isMapPage ? '' :
          <MapBackground fillColor={fillColor} strokeColor={strokeColor} />
        }
        <Navbar theme={theme} />
        <main className={styles.main}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
