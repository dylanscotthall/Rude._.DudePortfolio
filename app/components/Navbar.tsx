import Link from "next/link";
import React, { useState } from "react";
import { JSX } from "react";
import DarkmodeToggle from "./DarkmodeToggle";
import styles from "./Navbar.module.css";
import { ThemeContextType } from "../lib/interfaces";

interface NavbarProps {
  theme: ThemeContextType;
}

export default function Navbar({ theme }: NavbarProps): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { href: "/portfolio", label: "PORTFOLIO" },
    { href: "/photography", label: "PHOTOGRAPHY" },
    { href: "/videography", label: "VIDEOGRAPHY" },
    { href: "/map", label: "MAP" },
    { href: "/blog", label: "BLOG" },
    { href: "/contact", label: "CONTACT" },
    { href: "/about", label: "ABOUT" },
  ];

  return (
    <nav className={`${styles.nav} blur-background`}>
      {/* Logo */}
      <h1 className={styles.logo}>
        <Link href="/">RUDE._.DUDE</Link>
      </h1>

      {/* Desktop Links */}
      <ul className={styles.links}>
        {navLinks.map(link => (
          <li key={link.href}>
            <Link href={link.href} className={styles.link}>{link.label}</Link>
          </li>
        ))}
      </ul>

      {/* Hamburger Menu Button (mobile only) */}
      <button className={styles.hamburger} onClick={toggleMenu}>
        ☰
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <ul className={styles.mobileMenu}>
          {navLinks.map(link => (
            <li key={link.href} onClick={() => setMenuOpen(false)}>
              <Link href={link.href} className={styles.link}>{link.label}</Link>
            </li>
          ))}
        </ul>
      )}

      {/* Dark mode toggle */}
      <div className={styles.darkToggle}>
        <DarkmodeToggle theme={theme} />
      </div>
    </nav>
  );
}

