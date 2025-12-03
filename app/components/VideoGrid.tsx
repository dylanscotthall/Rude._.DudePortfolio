"use client";

import styles from "./VideoGrid.module.css";

interface VideoGridProps {
  items: string[];
  onClick?: (item: string) => void;
}

export default function VideoGrid({ items, onClick }: VideoGridProps) {
  return (
    <div className={styles.grid}>
      {items.map((video) => (
        <div
          key={video}
          className={`${styles.item} ${onClick ? styles.cursorPointer : ""}`}
          onClick={() => onClick?.(video)}
        >
          <video
            src={video}
            controls
            className={styles.video}
          />
        </div>
      ))}
    </div>
  );
}

