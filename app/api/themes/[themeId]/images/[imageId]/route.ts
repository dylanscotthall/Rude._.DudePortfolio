// app/api/themes/[themeId]/images/[imageId]/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: { params: { themeId: string; imageId: string } }) {
    // Await the params first
    const { themeId, imageId } = await context.params;

    if (!themeId || !imageId) {
        return NextResponse.json({ error: "Missing themeId or imageId" }, { status: 400 });
    }

    try {
        // Detach image from theme
        const updatedImage = await prisma.image.update({
            where: { id: imageId },
            data: { themeId: null },
        });

        return NextResponse.json(updatedImage);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to remove image" }, { status: 500 });
    }
}
