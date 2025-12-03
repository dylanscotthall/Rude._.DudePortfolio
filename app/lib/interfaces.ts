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