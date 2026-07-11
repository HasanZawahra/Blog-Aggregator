import { setUser } from "../config.js";

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error('The login handler expects a single argument: the username.');
  }

  const username = args[0];
  await setUser(username);
  
  console.log(`User has been set to: ${username}`);
}
