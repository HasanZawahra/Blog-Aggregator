import { readConfig } from "../../config.js";
import { getUsers } from "../../lib/db/queries/users.js";

export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {
  const allUsers = await getUsers();
  
  let currentUserName = '';
  try {
    const config = await readConfig();
    currentUserName = config.currentUserName;
  } catch (error) {
    // If config doesn't exist yet, proceed with no highlighted user
  }

  for (const user of allUsers) {
    if (user.name === currentUserName) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
}