'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import nextcloudLoader from '../lib/nextCloudLoader';
import { api, Theme, ThemeImage } from '@/app/lib/apiHelper';
import ImageGrid from '../components/ImageGrid';
import styles from './photography.module.css';

export default function Portfolio() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [themeCovers, setThemeCovers] = useState<Record<number, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [activeImages, setActiveImages] = useState<ThemeImage[]>([]);

  useEffect(() => {
    const load = async () => {
      const list = await api.fetchThemes();
      setThemes(list);
    };
    load();
  }, []);

  useEffect(() => {
    const loadCovers = async () => {
      const covers: Record<number, string> = {};
      for (const theme of themes) {
        if (!theme.coverImageId) continue;
        try {
          const img = await api.fetchImageById(theme.coverImageId);
          covers[theme.id] = img.fileUrl;
        } catch { }
      }
      setThemeCovers(covers);
    };

    if (themes.length) loadCovers();
  }, [themes]);

  const openThemeModal = async (theme: Theme) => {
    setActiveTheme(theme);
    try {
      const imgs = await api.fetchThemeImages(theme.id);
      setActiveImages(imgs);
    } catch (e) {
      console.error('Failed loading theme images', e);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveTheme(null);
    setActiveImages([]);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.themeGrid}>
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={styles.themeCard + ' ' + styles.paperBox}
              onClick={() => openThemeModal(theme)}
            >
              {themeCovers[theme.id] ? (
                <Image
                  loader={nextcloudLoader}
                  src={themeCovers[theme.id]}
                  alt={theme.name}
                  width={600}
                  height={400}
                  className={styles.themeCardImage}
                />
              ) : (
                <div className={styles.themeCardPlaceholder} />
              )}
              <div className={styles.themeCardLabel}>
                {theme.name.charAt(0).toUpperCase() +
                  theme.name.slice(1).replace(/([A-Z])/g, ' $1')}
              </div>
            </div>
          ))}
        </div>

        {modalOpen && (
          <div className={styles.modalBackdrop} onClick={closeModal}>
            <div
              className={styles.modalContent + ' ' + styles.paperBox}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>{activeTheme?.name}</h2>
                <button className={styles.closeBtn} onClick={closeModal}>
                  ✕
                </button>
              </div>

              <div className={styles.modalBody}>
                <ImageGrid
                  items={activeImages.map((img) => img.fileUrl)}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

