import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import styles from "./blog.module.css";

export default async function BlogIndex() {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      publishedAt: true,
      coverImage: true,
    },
  });

  return (
    < div className={styles.container} >
      <main className={styles.main}>
        {/* HERO */}
        <section className={`${styles.hero} border-blueprint`}>
          <div className={styles.heroContent}>
            <div className={styles.avatarWrap}>
              <Image
                src="/Blog_Placeholder.png"
                alt="Blog illustration"
                width={140}
                height={140}
                className={styles.avatar}
                priority
              />
            </div>
            <div className={styles.heroText}>
              <h1 className={styles.title}>Blog</h1>
              <p className={styles.lead}>
                Explore our latest stories, photography tips, and visual storytelling insights.
              </p>
            </div>
          </div>
        </section>

        {/* BLOG POSTS */}
        <section className={`${styles.section} border-blueprint`}>
          {posts.length === 0 ? (
            <p className={styles.paragraph}>No posts yet.</p>
          ) : (
            <ul className={styles.postList}>
              {posts.map((post) => (
                <li key={post.id} className={styles.postItem}>
                  <Link href={`/blog/${post.slug}`} className={styles.postLink}>
                    {post.coverImage && (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={300}
                        height={180}
                        className={styles.postCover}
                      />
                    )}
                    <strong>{post.title}</strong>
                  </Link>
                  {post.description && <p className={styles.paragraph}>{post.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div >
  );
}

