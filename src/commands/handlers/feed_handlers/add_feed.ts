import { createFeed } from "../../../db/queries/feeds.js";
import { createFeedFollow } from "../../../db/queries/feed_follow.js";
import { User } from "../../../types.js";

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  if (args.length < 2) {
    throw new Error('The addfeed command expects two arguments: a feed name and a feed URL.');
  }

  const feedName = args[0];
  const feedUrl = args[1];

  const newFeed = await createFeed(feedName, feedUrl, user.id);

  const followResult = await createFeedFollow(user.id, newFeed.id);

  console.log(`Feed '${feedName}' was successfully added.`);
  console.log(newFeed);
  console.log(`Automatically followed feed!`);
  console.log(`* Feed Name: ${followResult.feedName}`);
  console.log(`* User Name: ${followResult.userName}`);
}
