'use client';

import { useEffect, useState } from 'react';
import { MasonryPhotoAlbum } from 'react-photo-album';
import Image from 'next/image';
import nextcloudLoader from '../lib/nextCloudLoader';
import styles from './portfolio.module.css';
// import { api, ThemeImage } from '../lib/api';
import { getImageDimensions } from '../lib/getImageDimensions';
import { api, ThemeImage } from '../lib/apiHelper';

interface Photo {
    src: string;
    width: number;
    height: number;
}

export default function PhotographyPortfolioPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                // Fetch all or a limited batch of images (you can adjust this)
                const allImages: ThemeImage[] = await api.fetchAllImages(100);

                // Retrieve image dimensions via your proxy
                const scaleFactor = 0.2;
                const photosWithSizes = await Promise.all(
                    allImages.map(async (img) => {
                        const proxiedUrl = `/api/photo-proxy?url=${encodeURIComponent(img.fileUrl)}`;
                        try {
                            const { width, height } = await getImageDimensions(proxiedUrl);
                            return {
                                src: proxiedUrl,
                                width: width * scaleFactor,
                                height: height * scaleFactor
                            };
                        } catch (err) {
                            console.error('Failed to get dimensions for', img.fileUrl, err);
                            return null;
                        }
                    })
                );

                setPhotos(photosWithSizes.filter(Boolean) as Photo[]);
            } catch (err) {
                console.error('Error loading photos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, []);

    return (
        <div className={styles.container}>
            <main className={`${styles.main} border-blueprint`}>
                <h1 className={styles.heading}>Photography Portfolio</h1>

                {loading ? (
                    <p className={styles.loadingText}>Loading images...</p>
                ) : (
                    <MasonryPhotoAlbum
                        photos={photos}
                        columns={(containerWidth) => {
                            if (containerWidth < 400) return 2;
                            if (containerWidth < 800) return 3;
                            return 4;
                        }}
                        spacing={8}
                        renderPhoto={({ photo }) => (
                            <div className={styles.imageWrapper}>
                                <Image
                                    loader={nextcloudLoader}
                                    src={photo.src}
                                    alt=""
                                    width={photo.width}
                                    height={photo.height}
                                    className={styles.photoImage}
                                />
                            </div>
                        )}
                    />
                )}
            </main>
        </div>
    );
}
