export interface ThemeImage {
  id: string;
  fileUrl: string;
  locationId: number;
}

export interface Theme {
  id: number;
  name: string;
  images?: ThemeImage[];
  coverImageId?: string | null;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleDark: () => void;
  fillColor: string;
  strokeColor: string;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
} 
