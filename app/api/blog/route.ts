import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        coverImage: data.coverImage,
        content: data.content, // MDX text
        publishedAt: new Date(),
      },
    });

    return NextResponse.json(post);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 400 });
  }
}

