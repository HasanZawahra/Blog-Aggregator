import { setUser } from "../../config.js";
import { getUserByName, createUser } from "../../lib/db/queries/users.js";

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length === 0 || !args[0]) {
    throw new Error('The register handler expects a single argument: the username.');
  }

  const username = args[0];

  const existingUser = await getUserByName(username);
  if (existingUser) {
    throw new Error(`User with name '${username}' already exists.`);
  }

  const newUser = await createUser(username);

  await setUser(username);

  console.log(`User '${username}' was successfully created.`);
  console.log(newUser);
}
