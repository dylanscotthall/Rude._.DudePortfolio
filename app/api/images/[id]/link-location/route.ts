import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, context: { params: { id: string } }) {
    const { id } = context.params;
    const { locationId } = await req.json();

    const updated = await prisma.image.update({
        where: { id },
        data: { locationId },
        include: { location: true },
    });

    return NextResponse.json(updated);
}
