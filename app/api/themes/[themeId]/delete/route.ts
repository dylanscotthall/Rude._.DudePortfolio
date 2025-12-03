import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: { params: { themeId: string } }) {
    const themeId = parseInt(await context.params.themeId);
    if (!themeId) return NextResponse.json({ error: "Invalid theme ID" }, { status: 400 });

    try {
        // Optionally: delete associated images as well
        await prisma.image.deleteMany({ where: { themeId } });
        await prisma.theme.delete({ where: { id: themeId } });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Failed to delete theme" }, { status: 500 });
    }
}
