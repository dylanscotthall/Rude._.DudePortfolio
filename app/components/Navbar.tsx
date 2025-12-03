import Link from "next/link";
import React from "react";
import { JSX } from "react";
import DarkmodeToggle from "./DarkmodeToggle";
import styles from "./Navbar.module.css";
import { ThemeContextType } from "../lib/interfaces";

interface NavbarProps {
  theme: ThemeContextType;
}

export default function Navbar({ theme }: NavbarProps): JSX.Element {
  return (
    <nav className={styles.nav + ' blur-background'}>

      {/* Logo */}
      <h1 className={styles.logo}>
        <Link href="/">RUDE._.DUDE</Link>
      </h1>

      {/* Links container */}
      <ul className={styles.links}>
        <li>
          <Link href="/portfolio" className={styles.link}>PORTFOLIO</Link>
        </li>
        <li>
          <Link href="/photography" className={styles.link}>PHOTOGRAPHY</Link>
        </li>
        <li>
          <Link href="/videography" className={styles.link}>VIDEOGRAPHY</Link>
        </li>
        <li>
          <Link href="/map" className={styles.link}>MAP</Link>
        </li>
        <li>
          {/* TODO: Change to articles eventually */}
          <Link href="/blog" className={styles.link}>BLOG</Link>
        </li>
        <li>
          <Link href="/contact" className={styles.link}>CONTACT</Link>
        </li>
        <li>
          <Link href="/about" className={styles.link}>ABOUT</Link>
        </li>
      </ul>

      {/* Dark mode toggle */}
      <div className={styles.darkToggle}>
        <DarkmodeToggle theme={theme} />
      </div>
    </nav>
  );
}
