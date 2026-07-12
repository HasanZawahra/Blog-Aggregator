import { readConfig } from "../config.js";
import { getUserByName } from "../db/queries/users.js";
import { UserCommandHandler, CommandHandler } from "../types.js";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const config = await readConfig();
    if (!config.currentUserName) {
      throw new Error(`The command '${cmdName}' requires you to be logged in. Please use the login command first.`);
    }

    const currentUser = await getUserByName(config.currentUserName);
    if (!currentUser) {
      throw new Error(`The currently logged-in user '${config.currentUserName}' does not exist in the database.`);
    }

    await handler(cmdName, currentUser, ...args);
  };
}