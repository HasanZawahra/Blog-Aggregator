import { readConfig } from "../../../config.js";
import { createFeedFollow } from "../../../db/queries/feed_follow.js";
import { createFeed } from "../../../db/queries/feeds.js";
import { getUserByName } from "../../../db/queries/users.js";

export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length < 2) {
    throw new Error('The addfeed command expects two arguments: a feed name and a feed URL.');
  }

  const feedName = args[0];
  const feedUrl = args[1];

  const config = await readConfig();
  if (!config.currentUserName) {
    throw new Error('No user is currently logged in. Please log in first using the login command.');
  }

  const currentUser = await getUserByName(config.currentUserName);
  if (!currentUser) {
    throw new Error(`The currently logged-in user '${config.currentUserName}' does not exist in the database.`);
  }

  const newFeed = await createFeed(feedName, feedUrl, currentUser.id);

  const followResult = await createFeedFollow(currentUser.id, newFeed.id);

  console.log(`Feed '${feedName}' was successfully added.`);
  console.log(newFeed);
  console.log(`Automatically followed feed!`);
  console.log(`* **Feed Name**: ${followResult.feedName}`);
  console.log(`* **User Name**: ${followResult.userName}`);
}
