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

  const [fullImage, setFullImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

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

  // ESC closes modals
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullImage) setFullImage(null);
        else closeModal();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullImage]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* THEME GRID */}
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

        {/* THEME IMAGE MODAL */}
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
                  onClick={(url, index) => {
                    setFullImage(url);
                    setCurrentIndex(index);
                    setZoom(1);
                  }}
                />
              </div>
            </div>
          </div>
        )}


        {fullImage && (
          <div
            className={styles.fullImageBackdrop}
            onClick={() => setFullImage(null)}
          >
            <div
              className={styles.fullImageContainer}
              onClick={(e) => e.stopPropagation()} // keep modal clicks from closing
            >
              {/* Close and navigation buttons */}
              <button
                className={styles.fullImageClose}
                onClick={() => setFullImage(null)}
              >
                ✕
              </button>

              <button
                className={styles.fullImagePrev}
                onClick={() =>
                  setCurrentIndex(
                    (i) => (i - 1 + activeImages.length) % activeImages.length
                  )
                }
              >
                ‹
              </button>

              <button
                className={styles.fullImageNext}
                onClick={() =>
                  setCurrentIndex((i) => (i + 1) % activeImages.length)
                }
              >
                ›
              </button>

              {/* Zoomable viewport */}
              <div
                className={styles.fullImageViewport}
                onWheel={(e) => {
                  e.stopPropagation(); // allow buttons to work
                  e.preventDefault(); // prevent page scroll
                  setZoom((z) => Math.max(0.5, Math.min(z + e.deltaY * -0.002, 5)));
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    pointerEvents: "none", // make sure buttons work above
                  }}
                >
                  <Image
                    loader={nextcloudLoader}
                    src={activeImages[currentIndex]?.fileUrl || fullImage}
                    alt={fullImage}
                    fill
                    style={{
                      transform: `scale(${zoom})`,
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

