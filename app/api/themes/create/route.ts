import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

    const theme = await prisma.theme.create({ data: { name } });
    return NextResponse.json(theme);
}