import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// GET: Fetch all locations
export async function GET() {
  try {
    const locations = await prisma.location.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(locations);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

// POST: Create a new location
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, latitude, longitude } = body;

    if (!name || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const location = await prisma.location.create({ data: { name: name.split(',')[0].trim(), state: name.split(',')[1].trim(), country: name.split(',')[2].trim(), latitude, longitude } });
    return NextResponse.json(location);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
