"use client";

import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import Image from "next/image";
import styles from "./admin.module.css";
import nextcloudLoader from "../lib/nextCloudLoader";
import { api, Theme, ThemeImage, ThemeVideo } from "../lib/apiHelper";
import { usePhotos } from "../hooks/usePhotos";
import useVideos from "../hooks/useVideos";

/**
 * Admin page - unified images & videos management
 *
 * - Uses your existing `api` for theme/image/video CRUD
 * - Uses `usePhotos` (existing) to list available images from Nextcloud
 * - Uses `useVideos` (new) to list available videos (server-proxied)
 *
 * Notes:
 * - This uses your updated API shape (fetchThemeVideos, addVideoToTheme, etc.)
 * - Styling uses your existing admin.module.css class names
 */

export default function AdminPage() {
  // UI state
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<number | "">("");
  const [themeImages, setThemeImages] = useState<ThemeImage[]>([]);
  const [themeVideos, setThemeVideos] = useState<ThemeVideo[]>([]);
  const [newThemeName, setNewThemeName] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [locations, setLocations] = useState<
    { id: number; name: string; latitude: string; longitude: string }[]
  >([]);
  const [locationModal, setLocationModal] = useState<{ isOpen: boolean; mediaId: string | null }>({
    isOpen: false,
    mediaId: null,
  });

  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationLat, setNewLocationLat] = useState("");
  const [newLocationLng, setNewLocationLng] = useState("");

  // derived
  const selectedTheme = useMemo(() => themes.find((t) => t.id === selectedThemeId) ?? null, [
    themes,
    selectedThemeId,
  ]);
  const selectedThemeName = selectedTheme?.name ?? "";

  // hooks for available media from Nextcloud
  const { items: availableImages, loading: imagesLoading, error: imagesError } = usePhotos(selectedThemeName);
  const { items: availableVideos, loading: videosLoading, error: videosError } = useVideos(selectedThemeName);

  // load initial themes + locations
  useEffect(() => {
    let mounted = true;
    api
      .fetchThemes()
      .then((data) => {
        if (!mounted) return;
        setThemes(data || []);
        if (data && data.length > 0) setSelectedThemeId(data[0].id);
      })
      .catch((e) => console.error("Failed to load themes", e));

    api
      .fetchLocations()
      .then((data) => {
        if (!mounted) return;
        setLocations(data || []);
      })
      .catch((e) => console.error("Failed to load locations", e));

    return () => {
      mounted = false;
    };
  }, []);

  // whenever selected theme changes, load images & videos from DB
  useEffect(() => {
    if (!selectedThemeId) {
      setThemeImages([]);
      setThemeVideos([]);
      return;
    }

    let mounted = true;
    const id = Number(selectedThemeId);

    api
      .fetchThemeImages(id)
      .then((imgs) => {
        if (!mounted) return;
        setThemeImages((imgs || []).map((img) => ({ ...img, fileUrl: decodeURIComponent(img.fileUrl) })));
      })
      .catch((e) => {
        console.error("Failed to load theme images", e);
        setThemeImages([]);
      });

    api
      .fetchThemeVideos(id)
      .then((vids) => {
        if (!mounted) return;
        setThemeVideos((vids || []).map((v) => ({ ...v, fileUrl: decodeURIComponent(v.fileUrl) })));
      })
      .catch((e) => {
        console.warn("Failed to load theme videos", e);
        setThemeVideos([]);
      });

    return () => {
      mounted = false;
    };
  }, [selectedThemeId, themes]);

  /* ----------------------
     CRUD Handlers
  ---------------------- */

  const handleCreateTheme = async () => {
    if (!newThemeName.trim()) return alert("Enter theme name");
    try {
      const t = await api.createTheme(newThemeName.trim());
      setThemes((p) => [...p, t]);
      setNewThemeName("");
    } catch (err) {
      console.error(err);
      alert("Failed to create theme");
    }
  };

  const handleDeleteTheme = async () => {
    if (!selectedThemeId) return;
    if (!confirm("Delete theme?")) return;

    const id = Number(selectedThemeId);
    try {
      await api.deleteTheme(id);
      setThemes((p) => p.filter((x) => x.id !== id));
      setSelectedThemeId("");
      setThemeImages([]);
      setThemeVideos([]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete theme");
    }
  };

  // Add media to theme (image or video)
  const addMediaToTheme = async (fileUrl: string) => {
    if (!selectedThemeId) return alert("Select a theme first");
    const id = Number(selectedThemeId);

    try {
      if (mediaType === "image") {
        const newImg = await api.addImageToTheme(id, fileUrl);
        setThemeImages((p) => [...p, { ...newImg, fileUrl: decodeURIComponent(fileUrl) }]);
      } else {
        const newVid = await api.addVideoToTheme(id, fileUrl);
        setThemeVideos((p) => [...p, { ...newVid, fileUrl: decodeURIComponent(fileUrl) }]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add media to theme");
    }
  };

  // Remove media
  const removeMediaFromTheme = async (mediaId: string) => {
    if (!selectedThemeId) return;
    const id = Number(selectedThemeId);

    try {
      if (mediaType === "image") {
        await api.removeImageFromTheme(id, mediaId);
        setThemeImages((p) => p.filter((x) => x.id !== mediaId));
      } else {
        await api.removeVideoFromTheme(id, mediaId);
        setThemeVideos((p) => p.filter((x) => x.id !== mediaId));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to remove media");
    }
  };

  // set cover
  const setCoverForTheme = async (mediaId: string) => {
    if (!selectedThemeId) return;
    const id = Number(selectedThemeId);

    try {
      if (mediaType === "image") {
        await api.setCoverImage(id, mediaId);
        setThemes((p) => p.map((t) => (t.id === id ? { ...t, coverImageId: mediaId } : t)));
      } else {
        await api.setCoverVideo(id, mediaId);
        setThemes((p) => p.map((t) => (t.id === id ? { ...t, coverVideoId: mediaId } : t)));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to set cover");
    }
  };

  // link location
  const linkLocationToMedia = async (mediaId: string, locationId: number) => {
    try {
      if (mediaType === "image") {
        const updated = await api.linkLocationToImage(mediaId, locationId);
        setThemeImages((p) => p.map((img) => (img.id === mediaId ? { ...img, locationId: updated.locationId } : img)));
      } else {
        const updated = await api.linkLocationToVideo(mediaId, locationId);
        setThemeVideos((p) => p.map((v) => (v.id === mediaId ? { ...v, locationId: updated.locationId } : v)));
      }
      setLocationModal({ isOpen: false, mediaId: null });
    } catch (err) {
      console.error(err);
      alert("Failed to link location");
    }
  };

  // Create/delete locations
  const handleCreateLocation = async () => {
    if (!newLocationName.trim()) return alert("Enter name");
    try {
      const loc = await api.createLocation({ name: newLocationName, latitude: newLocationLat, longitude: newLocationLng });
      setLocations((p) => [...p, loc]);
      setNewLocationName("");
      setNewLocationLat("");
      setNewLocationLng("");
    } catch (err) {
      console.error(err);
      alert("Failed to add location");
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!confirm("Delete location?")) return;
    try {
      await api.deleteLocation(id);
      setLocations((p) => p.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete location");
    }
  };

  /* ----------------------
     Render
  ---------------------- */

  // choose available media list depending on mediaType
  const availableMedia = mediaType === "image" ? availableImages : availableVideos;
  const availableLoading = mediaType === "image" ? imagesLoading : videosLoading;
  const availableError = mediaType === "image" ? imagesError : videosError;

  // DB media in theme
  const dbMedia = mediaType === "image" ? themeImages.map((i) => ({ id: i.id, fileUrl: i.fileUrl, locationId: i.locationId })) : themeVideos.map((v) => ({ id: v.id, fileUrl: v.fileUrl, locationId: v.locationId }));

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div>
          <button className={styles.floatingCreateBlogButton} onClick={() => alert("Blog modal unchanged - keep your implementation")}>
            + Blog Post
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setMediaType("image")} className={`${styles.button} ${mediaType === "image" ? styles.selectedTheme : ""}`}>Images</button>
          <button onClick={() => setMediaType("video")} className={`${styles.button} ${mediaType === "video" ? styles.selectedTheme : ""}`}>Videos</button>
        </div>
      </div>

      <div className={styles.sectionsContainer} style={{ marginTop: 12 }}>
        {/* Locations */}
        <div className={styles.section + ' border-blueprint'}>
          <input placeholder="Location name" value={newLocationName} onChange={(e) => setNewLocationName(e.target.value)} className={styles.input} />
          <input placeholder="Lat" value={newLocationLat} onChange={(e) => setNewLocationLat(e.target.value)} className={styles.input} />
          <input placeholder="Lng" value={newLocationLng} onChange={(e) => setNewLocationLng(e.target.value)} className={styles.input} />
          <button onClick={handleCreateLocation} className={styles.button}>Add Location</button>

          <h3>All Locations</h3>
          <ul>
            {locations.map((loc) => (
              <li key={loc.id} style={{ display: "flex", justifyContent: "space-between" }}>
                - {loc.name} ({loc.latitude}, {loc.longitude})
                <button onClick={() => handleDeleteLocation(loc.id)} className={styles.iconButton}>×</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Theme manager */}
        <div className={styles.section + ' border-blueprint'}>
          <label className="font-semibold">Select theme:</label>
          <select value={selectedThemeId} onChange={(e) => setSelectedThemeId(Number(e.target.value))} className={styles.select}>
            <option value="">-- select --</option>
            {themes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          {selectedThemeId !== "" && (
            <button onClick={handleDeleteTheme} className={`${styles.button} ${styles.deleteButton}`}>Delete</button>
          )}
        </div>

        <div className={styles.section + ' border-blueprint'}>
          <input className={styles.input} placeholder="New theme name" value={newThemeName} onChange={(e) => setNewThemeName(e.target.value)} />
          <button onClick={handleCreateTheme} className={styles.button}>Create</button>
        </div>
      </div>

      {/* Available media from Nextcloud */}
      {selectedThemeId !== "" && (
        <>
          <h2 className={styles.title}>Available {mediaType === "image" ? "Images" : "Videos"}</h2>
          {availableLoading && <p>Loading...</p>}
          {availableError && <p style={{ color: "red" }}>Error loading available {mediaType}s</p>}

          <div className={styles.grid}>
            {availableMedia && availableMedia.length === 0 && <div style={{ padding: 12 }}>No available files in Nextcloud folder.</div>}
            {availableMedia?.map((url) => (
              <div key={url} className={styles.gridItem}>
                <div className={styles.imageContainer}>
                  {mediaType === "image" ? (
                    <Image loader={nextcloudLoader} src={url} alt={url} fill className={styles.image} />
                  ) : (
                    <video src={url} className={styles.image} controls />
                  )}
                  <button onClick={() => addMediaToTheme(url)} className={styles.addButton}>+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Media in Theme (DB) */}
          <h2 className={styles.title}>{mediaType === "image" ? "Images in Theme" : "Videos in Theme"}</h2>
          <div className={styles.grid}>
            {dbMedia.map((m) => {
              const isCover = mediaType === "image" ? selectedTheme?.coverImageId === m.id : selectedTheme?.coverVideoId === m.id;

              return (
                <div key={m.id} className={styles.gridItem}>
                  <div className={styles.imageContainer}>
                    {mediaType === "image" ? (
                      <Image loader={nextcloudLoader} src={m.fileUrl} alt={m.fileUrl} fill className={styles.image} />
                    ) : (
                      <video src={m.fileUrl} className={styles.image} controls />
                    )}

                    <div className={styles.overlayButtons}>
                      <button onClick={() => removeMediaFromTheme(m.id)} className={`${styles.iconButton} ${styles.removeButton}`} title="Remove">−</button>
                      <button onClick={() => setCoverForTheme(m.id)} className={`${styles.iconButton} ${styles.coverButton}`} title="Set as cover">★</button>
                      <button onClick={() => setLocationModal({ isOpen: true, mediaId: m.id })} className={`${styles.iconButton} ${styles.coordButton}`} title="Set coordinates">📍</button>
                    </div>

                    {isCover && <span className={styles.coverBadge}>★ Cover</span>}
                  </div>

                  {m.locationId && <p className={styles.coordinates}>{locations.find((loc) => loc.id === m.locationId)?.name}</p>}

                  {locationModal.isOpen && locationModal.mediaId === m.id && (
                    <div className={styles.locationModal}>
                      <Select
                        options={locations.map((loc) => ({ value: loc, label: loc.name }))}
                        onChange={(selected) => {
                          if (!selected) return;
                          linkLocationToMedia(locationModal.mediaId!, selected.value.id);
                        }}
                        autoFocus
                        placeholder="Select a location..."
                        isSearchable
                      />
                      <button onClick={() => setLocationModal({ isOpen: false, mediaId: null })} className={styles.closeModalButton}>×</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

