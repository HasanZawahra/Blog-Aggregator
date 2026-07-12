import { eq, desc } from "drizzle-orm";
import { db } from "../index.js";
import { posts, feedFollows } from "../scheme.js";


export async function createPost(post: {
  title: string;
  url: string;
  description: string | null;
  publishedAt: Date;
  feedId: string;
}) {
  const [result] = await db
    .insert(posts)
    .values({
      title: post.title,
      url: post.url,
      description: post.description,
      publishedAt: post.publishedAt,
      feedId: post.feedId,
    })
    .onConflictDoNothing({ target: posts.url })
    .returning();

  return result || null;
}

export async function getPostsForUser(userId: string, limit: number = 10) {
  return await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}