import { readConfig } from "../../../config.js";
import { getFeedByUrl, createFeedFollow, getFeedFollowsForUser } from "../../../db/queries/feed_follow.js";
import { getUserByName } from "../../../db/queries/users.js";

export async function handlerFollow(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error('The follow command expects a single argument: the feed URL.');
  }

  const feedUrl = args[0];

  const config = await readConfig();
  if (!config.currentUserName) {
    throw new Error('No user is currently logged in. Please log in first using the login command.');
  }

  const currentUser = await getUserByName(config.currentUserName);
  if (!currentUser) {
    throw new Error(`The current user '${config.currentUserName}' does not exist in the database.`);
  }

  const targetFeed = await getFeedByUrl(feedUrl);
  if (!targetFeed) {
    throw new Error(`No feed found in the database matching the URL: ${feedUrl}`);
  }

  const followResult = await createFeedFollow(currentUser.id, targetFeed.id);

  console.log(`Successfully followed feed!`);
  console.log(`* **Feed Name**: ${followResult.feedName}`);
  console.log(`* **User Name**: ${followResult.userName}`);
}


export async function handlerFollowing(cmdName: string, ...args: string[]): Promise<void> {
  const config = await readConfig();
  if (!config.currentUserName) {
    throw new Error('No user is currently logged in. Please log in first using the login command.');
  }

  const currentUser = await getUserByName(config.currentUserName);
  if (!currentUser) {
    throw new Error(`The current user '${config.currentUserName}' does not exist in the database.`);
  }

  const follows = await getFeedFollowsForUser(currentUser.id);

  if (follows.length === 0) {
    console.log(`User '${currentUser.name}' is not following any feeds.`);
    return;
  }

  console.log(`Feeds followed by '${currentUser.name}':`);
  for (const follow of follows) {
    console.log(`* ${follow.feedName}`);
  }
}
