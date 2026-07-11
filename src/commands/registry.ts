import { CommandHandler, CommandsRegistry } from "../types.js";

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
  registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
  const handler = registry[cmdName];
  
  if (!handler) {
    throw new Error(`Command not found: ${cmdName}`);
  }

  await handler(cmdName, ...args);
}