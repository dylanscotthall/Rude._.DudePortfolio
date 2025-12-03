import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { themeId: string } }) {
    const { themeId } = await context.params;
    if (!themeId) {
        return NextResponse.json({ error: "Missing themeId" }, { status: 400 });
    }

    try {
        const images = await prisma.image.findMany({
            where: { themeId: Number(themeId) },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(images);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
    }
}


export async function POST(req: Request, context: { params: { themeId: string } }) {
    const { themeId } = await context.params;
    if (!themeId) {
        return NextResponse.json({ error: "Missing themeId" }, { status: 400 });
    }

    const { fileUrl } = await req.json();
    if (!fileUrl) {
        return NextResponse.json({ error: "Missing fileUrl" }, { status: 400 });
    }

    try {
        // Create new image AND attach to theme
        const newImage = await prisma.image.create({
            data: {
                fileUrl,
                theme: { connect: { id: Number(themeId) } },
            },
        });

        return NextResponse.json(newImage);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to add image" }, { status: 500 });
    }
}