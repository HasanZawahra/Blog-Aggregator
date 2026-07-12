import { getNextFeedToFetch, markFeedFetched } from "../db/queries/feeds.js";
import { createPost } from "../db/queries/posts.js";
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

    let savedCount = 0;

    for (const item of feedData.items) {
      let publishedAtDate = new Date(item.pubDate);
      if (isNaN(publishedAtDate.getTime())) {
        publishedAtDate = new Date();
      }

      const savedPost = await createPost({
        title: item.title,
        url: item.link,
        description: item.description || null,
        publishedAt: publishedAtDate,
        feedId: nextFeed.id,
      });

      if (savedPost) {
        savedCount++;
      }
    }

    console.log(`Successfully scraped '${feedData.title}': saved ${savedCount} new posts.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error scraping feed '${nextFeed.name}': ${errorMessage}`);
    
    await markFeedFetched(nextFeed.id);
  }
}
