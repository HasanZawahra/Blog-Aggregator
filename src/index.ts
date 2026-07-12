import { handlerFollow, handlerFollowing, handlerUnfollow } from "./commands/handlers/feed_follow_habdlers/follow.js";
import { handlerAddFeed } from "./commands/handlers/feed_handlers/add_feed.js";
import { handlerAgg } from "./commands/handlers/feed_handlers/handler_agg.js";
import { handlerListFeeds } from "./commands/handlers/feed_handlers/list_feeds.js";
import { handlerBrowse } from "./commands/handlers/post_handlers/browse.js";
import { handlerUsers } from "./commands/handlers/user_handlers/list_users.js";
import { handlerLogin } from "./commands/handlers/user_handlers/login.js";
import { handlerRegister } from "./commands/handlers/user_handlers/register.js";
import { handlerReset } from "./commands/handlers/user_handlers/reset.js";
import { registerCommand, runCommand } from "./commands/registry.js";
import { CommandsRegistry } from "./types.js";
import { middlewareLoggedIn } from "./utils/middleware_logedin.js";

async function main() {
  let cr: CommandsRegistry = {};
  registerCommand(cr, "login", handlerLogin);
  registerCommand(cr, 'register', handlerRegister);
  registerCommand(cr, 'reset', handlerReset);
  registerCommand(cr, 'users', handlerUsers);
  registerCommand(cr, 'agg', handlerAgg);
  registerCommand(cr, 'addfeed', middlewareLoggedIn(handlerAddFeed));
  registerCommand(cr, 'feeds', handlerListFeeds);
  registerCommand(cr, 'follow', middlewareLoggedIn(handlerFollow));
  registerCommand(cr, 'following', middlewareLoggedIn(handlerFollowing));
  registerCommand(cr, "unfollow", middlewareLoggedIn(handlerUnfollow));
  registerCommand(cr, "browse", middlewareLoggedIn(handlerBrowse));

  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Error: Not enough arguments provided. Please specify a command.');
    process.exit(1);
  }

  const commandName = args[0];
  const commandArgs = args.slice(1);

  try {
    await runCommand(cr, commandName, ...commandArgs);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Execution error: ${errorMessage}`);
    process.exit(1);
  }
  process.exit(0);
  
}

main();
