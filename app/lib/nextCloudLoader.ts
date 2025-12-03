export default function nextcloudLoader({ src }: { src: string; }) {
    const url = `/api/photo-proxy?url=${encodeURIComponent(src)}`;
    console.log(url);
    return url;
}
