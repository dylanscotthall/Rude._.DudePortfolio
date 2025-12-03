import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import { parseMDX } from "@/app/lib/mdx";
import BlogMDX from "./BlogMDX";
import styles from "./blogSlug.module.css";

type Props = {
  params: { slug: string };
};

export default async function BlogPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return notFound();

  const mdxSource = await parseMDX(post.content);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={`${styles.section} ${styles.paperBox} border-blueprint`}>
          <h1 className={styles.title}>{post.title}</h1>
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className={styles.coverImage}
            />
          )}
          <BlogMDX source={mdxSource} />
        </section>
      </main>
    </div>
  );
}

