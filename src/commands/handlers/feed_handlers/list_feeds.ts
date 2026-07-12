import { getAllFeedsWithUsers } from "../../../db/queries/feeds.js";

export async function handlerListFeeds(cmdName: string, ...args: string[]): Promise<void> {
  const records = await getAllFeedsWithUsers();

  if (records.length === 0) {
    console.log('No feeds found in the database.');
    return;
  }

  for (const record of records) {
    console.log(`* **Name**: ${record.feedName}`);
    console.log(`  **URL**: ${record.feedUrl}`);
    console.log(`  **Created By**: ${record.userName}`);
    console.log('');
  }
}
