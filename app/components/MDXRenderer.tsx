// app/components/MDXRenderer.tsx
"use client";

import { MDXRemote } from "next-mdx-remote";
import { MDXComponents } from "./MDXComponents";

type Props = {
  source: any; // MDXRemoteSerializeResult
};

export default function MDXRenderer({ source }: Props) {
  return <MDXRemote {...source} components={MDXComponents} />;
}

