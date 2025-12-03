"use client";

import { MDXRemote } from "next-mdx-remote";
import { MDXComponents } from "@/app/components/MDXComponents";

type Props = {
  source: any; // MDXRemoteSerializeResult
};

export default function BlogMDX({ source }: Props) {
  return <MDXRemote {...source} components={MDXComponents} />;
}

