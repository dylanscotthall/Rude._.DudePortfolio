export default function nextcloudLoader({ src }: { src: string; }) {
  const url = `/api/photo-proxy?url=${encodeURIComponent(src)}`;
  return url;
}
