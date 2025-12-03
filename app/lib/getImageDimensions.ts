import sizeOf from "image-size";

/**
 * Fetches an image from a given URL and returns its dimensions.
 * Works via your existing Nextcloud proxy (so it stays authenticated).
 */
export async function getImageDimensions(imageUrl: string): Promise<{ width: number; height: number }> {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image for size: ${imageUrl}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    const dimensions = sizeOf(buffer);

    if (!dimensions.width || !dimensions.height) {
        throw new Error(`Could not determine size for ${imageUrl}`);
    }

    return { width: dimensions.width, height: dimensions.height };
}