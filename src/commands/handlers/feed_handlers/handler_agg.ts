import { parseDuration } from "../../../utils/parse_duration.js";
import { scrapeFeeds } from "../../../utils/scrape_feeds.js";

export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error("The agg command expects a single argument: time_between_reqs (e.g., '10s', '1m').");
  }

  const durationStr = args[0];
  const timeBetweenRequests = parseDuration(durationStr);

  console.log(`Collecting feeds every ${durationStr}`);

  const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Aggregator background error: ${errorMessage}`);
  };

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("\nShutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}
