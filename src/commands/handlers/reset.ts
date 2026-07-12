import { deleteAllUsers } from "../../lib/db/queries/users.js";

export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
  try {
    await deleteAllUsers();
    console.log('Database successfully reset: All users have been deleted.');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to reset database: ${errorMessage}`);
    process.exit(1);
  }
}
