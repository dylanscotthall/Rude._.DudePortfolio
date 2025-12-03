import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "50"); // Default 50
        const offset = parseInt(searchParams.get("offset") || "0");

        const images = await prisma.image.findMany({
            skip: offset,
            take: limit,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(images);
    } catch (error: any) {
        console.error("Failed to fetch images:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}