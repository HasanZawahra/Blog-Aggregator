import { setUser } from "../../config.js";
import { getUserByName } from "../../lib/db/queries/users.js";

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error('The login handler expects a single argument: the username.');
  }

  const username = args[0];

  const existingUser = await getUserByName(username);
  if (!existingUser) {
    throw new Error(`User with name '${username}' does not exist.`);
  }

  await setUser(username);
  
  console.log(`User has been set to: ${username}`);
}