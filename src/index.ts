import { handlerUsers } from "./commands/handlers/list_users.js";
import { handlerLogin } from "./commands/handlers/login.js";
import { handlerRegister } from "./commands/handlers/register.js";
import { handlerReset } from "./commands/handlers/reset.js";
import { registerCommand, runCommand } from "./commands/registry.js";
import { CommandsRegistry } from "./types.js";

async function main() {
  let cr: CommandsRegistry = {};
  registerCommand(cr, "login", handlerLogin);
  registerCommand(cr, 'register', handlerRegister);
  registerCommand(cr, 'reset', handlerReset);
  registerCommand(cr, 'users', handlerUsers);


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
