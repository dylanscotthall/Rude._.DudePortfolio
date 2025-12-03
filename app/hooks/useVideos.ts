// app/hooks/useVideos.ts
"use client";

import { useEffect, useState } from "react";

/**
 * useVideos - client hook that calls server-side route to list Nextcloud files
 * It expects a server API at /api/nextcloud/list?folder=<folderName>
 *
 * For your setup: we call folder = `${themeName}Vids`
 */

export default function useVideos(themeName: string | null | undefined) {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      setItems([]);

      if (!themeName) {
        setLoading(false);
        return;
      }

      try {
        // folder pattern: themeName + "Vids"
        const folder = `${themeName}Vids`;
        const res = await fetch(`/api/nextcloud/list?folder=${encodeURIComponent(folder)}`);
        if (!res.ok) throw new Error(`Failed to list videos: ${res.status}`);
        const json = await res.json();
        // json should be array of file URLs
        if (mounted) setItems(Array.isArray(json) ? json : []);
      } catch (err: any) {
        console.error("useVideos error", err);
        if (mounted) setError(err.message || "Failed to load videos");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [themeName]);

  return { items, loading, error };
}

