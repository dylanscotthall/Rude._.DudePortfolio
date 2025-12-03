import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request, context: { params: { themeId: string } }) {
    const themeId = Number(await context.params.themeId);
    const { imageId } = await req.json();

    if (!imageId) {
        return NextResponse.json({ error: "Missing imageId" }, { status: 400 });
    }

    try {
        const theme = await prisma.theme.update({
            where: { id: themeId },
            data: { coverImageId: imageId },
            include: { coverImage: true },
        });

        return NextResponse.json(theme);
    } catch (err) {
        console.error("Failed to set cover image:", err);
        return NextResponse.json({ error: "Failed to set cover image" }, { status: 500 });
    }
}
