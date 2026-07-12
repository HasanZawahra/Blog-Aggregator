import { getFeedByUrl, createFeedFollow, getFeedFollowsForUser, deleteFeedFollow } from "../../../db/queries/feed_follow.js";
import { User } from "../../../types.js";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    throw new Error('The follow command expects a single argument: the feed URL.');
  }

  const feedUrl = args[0];

  const targetFeed = await getFeedByUrl(feedUrl);
  if (!targetFeed) {
    throw new Error(`No feed found in the database matching the URL: ${feedUrl}`);
  }

  const followResult = await createFeedFollow(user.id, targetFeed.id);

  console.log(`Successfully followed feed!`);
  console.log(`* Feed Name: ${followResult.feedName}`);
  console.log(`* User Name: ${followResult.userName}`);
}

export async function handlerFollowing(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  const follows = await getFeedFollowsForUser(user.id);

  if (follows.length === 0) {
    console.log(`User '${user.name}' is not following any feeds.`);
    return;
  }

  console.log(`Feeds followed by '${user.name}':`);
  for (const follow of follows) {
    console.log(`* ${follow.feedName}`);
  }
}

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    throw new Error("The unfollow command expects a single argument: the feed URL.");
  }

  const feedUrl = args[0];

  await deleteFeedFollow(user.id, feedUrl);

  console.log(`Successfully unfollowed the feed at: ${feedUrl}`);
}