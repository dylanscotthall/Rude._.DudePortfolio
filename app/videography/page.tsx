"use client";

import { useEffect, useState } from "react";
import { api, Theme, ThemeVideo } from "@/app/lib/apiHelper";
import VideoGrid from "../components/VideoGrid";
import styles from "./videography.module.css";

export default function Videography() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<number | "">("");
  const [themeVideos, setThemeVideos] = useState<ThemeVideo[]>([]);
  const [themeCovers, setThemeCovers] = useState<Record<number, string>>({});

  // Load all themes
  useEffect(() => {
    const loadThemes = async () => {
      try {
        const data = await api.fetchThemes();
        setThemes(data || []);

        if (data?.length) {
          const firstTheme = data[0];
          setSelectedThemeId(firstTheme.id);
          const videos = await api.fetchThemeVideos(firstTheme.id);
          setThemeVideos(videos || []);
        }
      } catch (err) {
        console.error("Failed to load themes", err);
      }
    };
    loadThemes();
  }, []);

  // Load theme cover videos (optional thumbnails)
  useEffect(() => {
    const loadCovers = async () => {
      const covers: Record<number, string> = {};
      await Promise.all(
        themes.map(async (theme) => {
          if (!theme.coverVideoId) return;
          try {
            const video = await api.fetchVideoById(theme.coverVideoId);
            covers[theme.id] = video.thumbnailUrl || "";
          } catch (err) {
            console.error(`Failed to fetch cover for theme ${theme.id}`, err);
          }
        })
      );
      setThemeCovers(covers);
    };

    if (themes.length > 0) loadCovers();
  }, [themes]);

  // Load videos when theme changes
  useEffect(() => {
    const loadThemeVideos = async () => {
      if (!selectedThemeId) return;
      try {
        const videos = await api.fetchThemeVideos(Number(selectedThemeId));
        setThemeVideos(videos || []);
      } catch (err) {
        console.error("Failed to load theme videos", err);
      }
    };
    loadThemeVideos();
  }, [selectedThemeId]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Theme Selector */}
        <div className={styles.themesScrollContainer}>
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`${styles.themeBox} ${selectedThemeId === theme.id ? styles.selectedTheme : ""}`}
              onClick={() => setSelectedThemeId(theme.id)}
            >
              {themeCovers[theme.id] && (
                <img
                  src={themeCovers[theme.id]}
                  alt={`Cover for ${theme.name}`}
                  className={styles.themeCoverImage}
                />
              )}
              <span className={styles.themeName}>
                {theme.name.charAt(0).toUpperCase() + theme.name.slice(1).replace(/([A-Z])/g, " $1")}
              </span>
            </div>
          ))}
        </div>

        {/* Video Grid */}
        <VideoGrid items={themeVideos.map((v) => v.fileUrl)} />
      </main>
    </div>
  );
}

