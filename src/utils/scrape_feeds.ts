import { getNextFeedToFetch, markFeedFetched } from "../db/queries/feeds.js";
import { fetchFeed } from "../services/fetch_feed.js";

export async function scrapeFeeds(): Promise<void> {
  const nextFeed = await getNextFeedToFetch();
  if (!nextFeed) {
    console.log("No feeds found in the database to scrape.");
    return;
  }

  try {
    console.log(`Scraping feed: '${nextFeed.name}' (${nextFeed.url})...`);

    const feedData = await fetchFeed(nextFeed.url);

    await markFeedFetched(nextFeed.id);

    console.log(`Found ${feedData.items.length} items inside '${feedData.title}':`);
    for (const item of feedData.items) {
      console.log(`* ${item.title}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error scraping feed '${nextFeed.name}': ${errorMessage}`);
    
    await markFeedFetched(nextFeed.id);
  }
}
