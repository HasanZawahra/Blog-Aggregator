import { users, feeds } from "../db/scheme.js";

export type User = typeof users.$inferSelect;
export type Feed = typeof feeds.$inferSelect;

export function printFeed(feed: Feed, user: User): void {
  console.log(`* **ID**: ${feed.id}`);
  console.log(`* **Name**: ${feed.name}`);
  console.log(`* **URL**: ${feed.url}`);
  console.log(`* **Created By**: ${user.name} (${feed.userId})`);
  console.log(`* **Created At**: ${feed.createdAt}`);
  console.log(`* **Updated At**: ${feed.updatedAt}`);
}
