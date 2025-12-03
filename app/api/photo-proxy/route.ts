// app/api/photo-proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // disable static caching

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl)
        return NextResponse.json({ error: "Missing image URL" }, { status: 400 });

    // ✅ Replace with your Nextcloud credentials
    const NEXTCLOUD_USERNAME = process.env.NEXTCLOUD_USER!;
    const NEXTCLOUD_PASSWORD = process.env.NEXTCLOUD_PASSWORD!;

    if (!NEXTCLOUD_USERNAME || !NEXTCLOUD_PASSWORD) {
        console.error("Nextcloud credentials not set in .env.local");
        return NextResponse.json({ error: "Missing credentials" }, { status: 500 });
    }

    try {
        const authHeader =
            "Basic " + Buffer.from(`${NEXTCLOUD_USERNAME}:${NEXTCLOUD_PASSWORD}`).toString("base64");

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        const response = await fetch(imageUrl, {
            method: "GET",
            headers: { Authorization: authHeader },
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
            console.error(`Failed to fetch ${imageUrl}:`, response.status, response.statusText);
            return NextResponse.json({ error: "Failed to fetch image" }, { status: response.status });
        }

        const contentType = response.headers.get("content-type") || "image/jpeg";

        return new NextResponse(response.body, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=3600, immutable",
            },
        });
    } catch (error: any) {
        console.error("Error fetching image:", error);
        return NextResponse.json({ error: error.message || "Error fetching image" }, { status: 500 });
    }
}
