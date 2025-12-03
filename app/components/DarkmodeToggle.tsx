'use client';
import { useState } from 'react';
import { Sun, Moon, X } from 'lucide-react';
import styles from './DarkmodeToggle.module.css';
import { ThemeContextType } from '../lib/interfaces';

interface DarkmodeToggleProps {
  theme: ThemeContextType;
}

export default function DarkmodeToggle({ theme }: DarkmodeToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.toggleWrapper}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.toggleButton}`}
      >
        {theme.isDark ? <Moon size={24} /> : <Sun size={24} />}
      </button>

      {isOpen && (
        <div className={styles.modal + ' border-blueprint'}>
          <div className={styles.modalHeader}>
            <span>Theme Settings</span>
            <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
              <X size={18} />
            </button>
          </div>

          <div className={styles.modalContent}>
            <div className={styles.switchWrapper}>
              <label>
                <input
                  type="checkbox"
                  checked={theme.isDark}
                  onChange={theme.toggleDark}
                />
                Dark Mode
              </label>
            </div>

            <div className={styles.colorPickerWrapper}>
              <label>
                Fill:
                <input
                  type="color"
                  value={theme.fillColor}
                  onChange={(e) => theme.setFillColor(e.target.value)}
                />
              </label>
              <label>
                Stroke:
                <input
                  type="color"
                  value={theme.strokeColor}
                  onChange={(e) => theme.setStrokeColor(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

