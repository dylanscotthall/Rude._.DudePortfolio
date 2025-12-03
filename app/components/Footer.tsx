// components/Footer.tsx
import { JSX } from "react";
import styles from "./Footer.module.css";

export default function Footer(): JSX.Element {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} RUDE._.DUDE</p>
    </footer>
  );
}
