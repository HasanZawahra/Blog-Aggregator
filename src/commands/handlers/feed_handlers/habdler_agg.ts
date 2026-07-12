import { fetchFeed } from "../../../services/fetch_feed.js";

export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {
  const targetUrl = 'https://www.wagslane.dev/index.xml';
  
  console.log(`Fetching feed from ${targetUrl}...`);
  try {
    const feed = await fetchFeed(targetUrl);
    console.log(JSON.stringify(feed, null, 2));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to aggregate feed: ${errorMessage}`);
    process.exit(1);
  }
}
