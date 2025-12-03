// app/components/MDXComponents.tsx
"use client";

import React from "react";

const getYouTubeId = (url: string) => {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const MDXComponents = {
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => {
    if (!href) return <span>{children}</span>;

    // Detect YouTube links
    if (href.includes("youtube.com") || href.includes("youtu.be")) {
      const videoId = getYouTubeId(href);
      if (!videoId) return <a href={href}>{children}</a>; // fallback link

      return (
        <div style={{ margin: "20px 0" }}>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    // Detect Spotify links
    if (href.includes("spotify.com")) {
      return (
        <iframe
          style={{ borderRadius: 12 }}
          src={href.replace("open.spotify.com", "open.spotify.com/embed")}
          width="100%"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
        />
      );
    }

    // Default link style
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#1d4ed8", textDecoration: "underline" }}
      >
        {children}
      </a>
    );
  },
};

