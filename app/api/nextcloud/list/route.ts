// app/api/nextcloud/list/route.ts
import { NextResponse } from "next/server";

const NEXTCLOUD_BASE = process.env.NEXTCLOUD_BASE;
const NEXTCLOUD_USER = process.env.NEXTCLOUD_USER;
const NEXTCLOUD_TOKEN = process.env.NEXTCLOUD_TOKEN;

function basicAuthHeader() {
  if (!NEXTCLOUD_USER || !NEXTCLOUD_TOKEN) return null;
  return `Basic ${Buffer.from(`${NEXTCLOUD_USER}:${NEXTCLOUD_TOKEN}`).toString("base64")}`;
}

async function parsePropfind(xmlText: string): Promise<string[]> {
  // Simple extraction of href tags. For robust parsing consider xml2js.
  const matches = Array.from(xmlText.matchAll(/<D:href>(.*?)<\/D:href>/g)).map((m) => m[1]);
  return matches;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const folder = url.searchParams.get("folder");
  if (!folder) {
    return NextResponse.json({ error: "Missing folder param" }, { status: 400 });
  }

  if (!NEXTCLOUD_BASE || !NEXTCLOUD_USER || !NEXTCLOUD_TOKEN) {
    return NextResponse.json({ error: "Nextcloud not configured" }, { status: 500 });
  }

  // Remote path under Nextcloud WebDAV
  const remotePath = `/remote.php/dav/files/${encodeURIComponent(NEXTCLOUD_USER)}/${encodeURIComponent(folder)}/`;
  const propfindUrl = `${NEXTCLOUD_BASE}${remotePath}`;

  const auth = basicAuthHeader();
  if (!auth) return NextResponse.json({ error: "Missing credentials" }, { status: 500 });

  try {
    const res = await fetch(propfindUrl, {
      method: "PROPFIND",
      headers: {
        Authorization: auth,
        Depth: "1",
        Accept: "application/xml",
      },
    });

    if (!res.ok) {
      // If folder doesn't exist, return empty array
      if (res.status === 404) return NextResponse.json([], { status: 200 });
      const text = await res.text();
      return NextResponse.json({ error: text || res.statusText }, { status: res.status });
    }

    const xml = await res.text();
    const hrefs = await parsePropfind(xml);

    // filter and build full URLs, ignoring self href
    const files = hrefs
      .map((h) => h.trim())
      .filter(Boolean)
      .filter((h) => !h.endsWith(remotePath)) // skip the folder itself
      .map((h) => {
        if (h.startsWith("http://") || h.startsWith("https://")) return h;
        return `${NEXTCLOUD_BASE}${h}`;
      })
      // only common video extensions (you can adjust)
      .filter((f) => /\.(mp4|webm|mov|mkv|ogg)$/i.test(f));

    return NextResponse.json(files);
  } catch (err) {
    console.error("nextcloud list error", err);
    return NextResponse.json({ error: "Failed to list Nextcloud folder" }, { status: 500 });
  }
}

