// app/hooks/usePhotos.ts
import { useState, useEffect } from "react";

/**
 * Returns an array of photo URLs fetched from /api/photos?dir=...
 * - dir: the remote folder path or theme name mapped to a path on the server
 */
export function usePhotos(dir?: string) {
    const [items, setItems] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!dir) {
            setItems([]);
            setError(null);
            return;
        }

        let cancelled = false;
        async function fetchPhotos() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/photos?dir=${encodeURIComponent(dir)}`);
                if (!res.ok) {
                    const body = await res.text();
                    throw new Error(`Photos API error: ${res.status} ${body}`);
                }
                const data = await res.json();
                if (!cancelled) setItems(Array.isArray(data.files) ? data.files : []);
            } catch (err: any) {
                if (!cancelled) setError(err.message || "Unknown error");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchPhotos();
        return () => {
            cancelled = true;
        };
    }, [dir]);

    return { items, loading, error };
}
