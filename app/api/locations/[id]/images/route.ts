// app/api/locations/[id]/images/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Disable caching for live updates
export async function GET(
    req: Request,
    context: { params: { id: string } }
) {
    const locationId = parseInt((await context.params.id), 10);
    if (isNaN(locationId)) {
        return NextResponse.json({ error: "Invalid location ID" }, { status: 400 });
    }

    try {
        const images = await prisma.image.findMany({
            where: { locationId },
            select: {
                id: true,
                fileUrl: true,
            },
        });

        return NextResponse.json(images);
    } catch (error) {
        console.error("Error fetching images for location:", error);
        return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
    }
}
