import { getPostsForUser } from "../../../db/queries/posts.js";
import { User } from "../../../types.js";

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  let limit = 2;
  if (args.length > 0) {
    const parsedLimit = parseInt(args[0], 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      limit = parsedLimit;
    }
  }

  const posts = await getPostsForUser(user.id, limit);

  if (posts.length === 0) {
    console.log(`No posts found from the feeds you follow.`);
    return;
  }

  console.log(`Showing the latest ${posts.length} posts for ${user.name}:\n`);
  for (const post of posts) {
    console.log(`=========================================`);
    console.log(`**Title**: ${post.title}`);
    console.log(`**Link**: ${post.url}`);
    console.log(`**Published**: ${post.publishedAt.toLocaleString()}`);
    if (post.description) {
      console.log(`**Description**: ${post.description.substring(0, 200)}...`);
    }
    console.log(`=========================================\n`);
  }
}
