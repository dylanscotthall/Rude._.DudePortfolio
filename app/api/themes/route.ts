import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const themes = await prisma.theme.findMany({ include: { coverImage: true } });
    return NextResponse.json(themes);
}