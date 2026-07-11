export type CommandHandler = (cmdName: string, ...args: string[]) => void | Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;