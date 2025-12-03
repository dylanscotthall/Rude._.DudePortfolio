// components/ImageGrid.tsx
"use client";

import Image from "next/image";
import { JSX } from "react";
import styles from "./ImageGrid.module.css";
import nextcloudLoader from "../lib/nextCloudLoader";

interface ImageGridProps {
  items: string[];
  onClick?: (item: string, index: number) => void;
  overlay?: (item: string) => JSX.Element;
  useNextImage?: boolean; // default true
}

export default function ImageGrid({
  items,
  onClick,
  overlay,
  useNextImage = true,
}: ImageGridProps) {
  return (
    <div className={styles.grid}>
      {items.map((item, index) => (
        <div
          key={item}
          className={`${styles.item} ${onClick ? styles.cursorPointer : ""} group`}
          onClick={() => onClick?.(item, index)}
        >
          {useNextImage ? (
            <Image
              loader={nextcloudLoader}
              src={item}
              alt={item}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 250px"
              className={styles.nextImage}
            />
          ) : (
            <img src={item} alt={item} className="" />
          )}

          {overlay && (
            <div className={styles.overlayContainer}>
              {overlay(item)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
