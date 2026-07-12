export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface RSSFeed {
  title: string;
  link: string;
  description: string;
  items: RSSItem[];
}
