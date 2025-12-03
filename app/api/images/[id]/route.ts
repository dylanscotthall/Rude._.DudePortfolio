import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json({ error: "Missing image ID" }, { status: 400 });
    }

    const image = await prisma.image.findUnique({
        where: { id }, // use string directly
    });

    if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(image);
}
