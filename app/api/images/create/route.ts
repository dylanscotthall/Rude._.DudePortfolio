import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { themeId, fileUrl, coordinates } = await req.json();

    if (!themeId || !fileUrl)
        return NextResponse.json({ error: "Missing themeId or fileUrl" }, { status: 400 });

    const image = await prisma.image.create({
        data: { themeId, fileUrl, coordinates },
    });

    return NextResponse.json(image);
}