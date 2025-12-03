import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node runtime

export async function GET(request: Request): Promise<Response> {
    try {
        const { searchParams } = new URL(request.url);
        const dir = (searchParams.get("dir") || "").replace(/^\//, ""); // sanitize

        const baseUrl = process.env.NEXTCLOUD_URL;
        const username = process.env.NEXTCLOUD_USER;
        const password = process.env.NEXTCLOUD_PASSWORD;

        if (!baseUrl || !username || !password) {
            return NextResponse.json({ error: "Missing Nextcloud credentials or URL" }, { status: 500 });
        }

        // Build PROPFIND path: if dir is empty use root folder for that user
        // Example: `${baseUrl}/remote.php/dav/files/${username}/${dir}`
        const folderUrl = `${baseUrl.replace(/\/$/, "")}/remote.php/dav/files/${encodeURIComponent(
            username
        )}/${encodeURIComponent(dir)}/`;

        const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

        const res = await fetch(folderUrl, {
            method: "PROPFIND",
            headers: {
                Authorization: authHeader,
                Depth: "1",
                "Content-Type": "application/xml",
            },
        });

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json({ error: "Nextcloud returned error", details: text }, { status: res.status });
        }

        const xml = await res.text();
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
        const json = parser.parse(xml);

        const multistatus = json["d:multistatus"] || json["D:multistatus"];
        const resp = multistatus && multistatus["d:response"] ? multistatus["d:response"] : [];

        const responses = Array.isArray(resp) ? resp : [resp];

        const files = responses
            .map((r: any) => {
                const href = r["d:href"] || r["D:href"];
                const propstat = r["d:propstat"] || r["D:propstat"];
                const prop = propstat && (propstat["d:prop"] || propstat["D:prop"]);
                const resourcetype = prop && (prop["d:resourcetype"] || prop["D:resourcetype"]);

                // If resourcetype is empty or missing => treat as file
                const isFile =
                    resourcetype === "" || resourcetype === undefined || (typeof resourcetype === "object" && Object.keys(resourcetype).length === 0);

                if (!href || !isFile) return null;

                // href can be like /remote.php/dav/files/username/path/to/file.jpg
                // Convert to public URL: baseUrl + the path after /remote.php/dav/files/username/
                const parts = String(href).split(`/remote.php/dav/files/${username}/`);
                if (parts.length < 2) return null;
                const relativePath = parts[1];
                return `${baseUrl.replace(/\/$/, "")}/remote.php/dav/files/${encodeURIComponent(username)}/${relativePath}`;
            })
            .filter(Boolean);

        return NextResponse.json({ files });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
    }
}
