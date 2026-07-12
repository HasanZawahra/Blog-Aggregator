import { XMLParser } from 'fast-xml-parser';
import { RSSFeed, RSSItem } from '../types.js';

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    headers: {
      'User-Agent': 'gator',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feed from ${feedURL}: ${response.statusText}`);
  }

  const xmlText = await response.text();

  const parser = new XMLParser({
    processEntities: false,
  });
  
  const parsedData = parser.parse(xmlText);

  const channel = parsedData?.rss?.channel;
  if (!channel) {
    throw new Error('Invalid feed structure: Missing rss.channel element.');
  }

  const title = channel.title;
  const link = channel.link;
  const description = channel.description;

  if (typeof title !== 'string' || typeof link !== 'string' || typeof description !== 'string') {
    throw new Error('Invalid feed structure: Channel metadata is missing or corrupted.');
  }

  let rawItems: any[] = [];
  if (channel.item) {
    rawItems = Array.isArray(channel.item) ? channel.item : [channel.item];
  }

  const items: RSSItem[] = [];

  for (const item of rawItems) {
    const itemTitle = item.title;
    const itemLink = item.link;
    const itemDescription = item.description;
    const itemPubDate = item.pubDate;

    if (
      typeof itemTitle !== 'string' ||
      typeof itemLink !== 'string' ||
      typeof itemDescription !== 'string' ||
      typeof itemPubDate !== 'string'
    ) {
      continue;
    }

    items.push({
      title: itemTitle,
      link: itemLink,
      description: itemDescription,
      pubDate: itemPubDate,
    });
  }

  return {
    title,
    link,
    description,
    items,
  };
}
