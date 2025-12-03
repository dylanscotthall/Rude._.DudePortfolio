// app/lib/api.ts

// ---------- TYPES ----------
export interface Theme {
  id: number;
  name: string;
  coverImageId?: string | null;
  coverVideoId?: string | null;       // NEW
  createdAt: string;
}

export interface ThemeImage {
  id: string;
  themeId: number;
  fileUrl: string;
  locationId?: number | null;
  createdAt: string;
}

export interface ThemeVideo {
  id: string;
  themeId: number;
  fileUrl: string;
  locationId?: number | null;
  createdAt: string;
}

export interface Location {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  createdAt: string;
}

// ---------- BLOG TYPES ----------
export interface CreateBlogPostInput {
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  content: string;
}

// ---------- HELPER ----------
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }
  return res.json();
};

// ---------- API OBJECT ----------
export const api = {
  // ----- THEMES -----
  fetchThemes: async (): Promise<Theme[]> =>
    handleResponse(await fetch("/api/themes")),

  fetchThemeImages: async (themeId: number): Promise<ThemeImage[]> =>
    handleResponse(await fetch(`/api/themes/${themeId}/images`)),

  fetchThemeVideos: async (themeId: number): Promise<ThemeVideo[]> =>
    handleResponse(await fetch(`/api/themes/${themeId}/videos`)),   // NEW

  createTheme: async (name: string): Promise<Theme> =>
    handleResponse(
      await fetch("/api/themes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
    ),

  deleteTheme: async (id: number): Promise<boolean> =>
    handleResponse(
      await fetch(`/api/themes/${id}/delete`, { method: "DELETE" })
    ).then(() => true),

  // ----- IMAGES -----
  addImageToTheme: async (themeId: number, fileUrl: string): Promise<ThemeImage> =>
    handleResponse(
      await fetch(`/api/themes/${themeId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl }),
      })
    ),

  removeImageFromTheme: async (themeId: number, imageId: string): Promise<boolean> =>
    handleResponse(
      await fetch(`/api/themes/${themeId}/images/${imageId}`, {
        method: "DELETE",
      })
    ).then(() => true),

  setCoverImage: async (themeId: number, imageId: string): Promise<Theme> =>
    handleResponse(
      await fetch(`/api/themes/${themeId}/cover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId, imageId }),
      })
    ),

  // ----- VIDEOS (NEW) -----
  addVideoToTheme: async (themeId: number, fileUrl: string): Promise<ThemeVideo> =>
    handleResponse(
      await fetch(`/api/themes/${themeId}/videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl }),
      })
    ),

  removeVideoFromTheme: async (themeId: number, videoId: string): Promise<boolean> =>
    handleResponse(
      await fetch(`/api/themes/${themeId}/videos/${videoId}`, {
        method: "DELETE",
      })
    ).then(() => true),

  setCoverVideo: async (themeId: number, videoId: string): Promise<Theme> =>
    handleResponse(
      await fetch(`/api/themes/${themeId}/cover-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId, videoId }),
      })
    ),

  // ----- LOCATION -----
  fetchLocations: async (): Promise<Location[]> =>
    handleResponse(await fetch("/api/locations")),

  createLocation: async (payload: {
    name: string;
    latitude: string;
    longitude: string;
  }): Promise<Location> =>
    handleResponse(
      await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    ),

  deleteLocation: async (id: number): Promise<boolean> =>
    handleResponse(
      await fetch(`/api/locations/${id}/delete`, { method: "DELETE" })
    ).then(() => true),

  // ----- LOCATION LINKING -----
  linkLocationToImage: async (imageId: string, locationId: number): Promise<ThemeImage> =>
    handleResponse(
      await fetch(`/api/images/${imageId}/link-location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId }),
      })
    ),

  linkLocationToVideo: async (videoId: string, locationId: number): Promise<ThemeVideo> =>
    handleResponse(
      await fetch(`/api/videos/${videoId}/link-location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId }),
      })
    ), // NEW

  // ----- LOCATION IMAGES & VIDEOS -----
  fetchLocationImages: async (locationId: number): Promise<ThemeImage[]> =>
    handleResponse(await fetch(`/api/locations/${locationId}/images`)),

  fetchLocationVideos: async (locationId: number): Promise<ThemeVideo[]> =>
    handleResponse(await fetch(`/api/locations/${locationId}/videos`)),  // NEW

  // ----- FILE FETCHING -----
  fetchImageById: async (imageId: string): Promise<ThemeImage> =>
    handleResponse(await fetch(`/api/images/${imageId}`)),

  fetchVideoById: async (videoId: string): Promise<ThemeVideo> =>
    handleResponse(await fetch(`/api/videos/${videoId}`)),             // NEW

  // ----- ALL IMAGES & VIDEOS -----
  fetchAllImages: async (limit: number = 50, offset: number = 0): Promise<ThemeImage[]> =>
    handleResponse(await fetch(`/api/images?limit=${limit}&offset=${offset}`)),

  fetchAllVideos: async (limit: number = 50, offset: number = 0): Promise<ThemeVideo[]> =>
    handleResponse(await fetch(`/api/videos?limit=${limit}&offset=${offset}`)), // NEW

  // ----- BLOG POSTS -----
  createBlogPost: async (data: CreateBlogPostInput) =>
    handleResponse(
      await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    ),
};

