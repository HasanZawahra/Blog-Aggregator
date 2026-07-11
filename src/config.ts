import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const CONFIG_FILE_NAME = '.gatorconfig.json';

export type Config = {
  dbUrl: string;
  currentUserName: string;
}

type JsonConfig = {
  db_url: string;
  current_user_name: string;
}

function getConfigFilePath(): string {
  return path.join(os.homedir(), CONFIG_FILE_NAME);
}

export function validateConfig(rawConfig: any): Config {
  if (!rawConfig || typeof rawConfig !== 'object') {
    throw new Error('Invalid configuration: data must be a JSON object');
  }

  const dbUrl = rawConfig.db_url || rawConfig.dbUrl || '';
  const currentUserName = rawConfig.current_user_name || rawConfig.currentUserName || '';

  return {
    dbUrl: typeof dbUrl === 'string' ? dbUrl : '',
    currentUserName: typeof currentUserName === 'string' ? currentUserName : '',
  };
}

export async function readConfig(): Promise<Config> {
  const filePath = getConfigFilePath();
  try {
    const rawData = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(rawData);
    return validateConfig(json);
  } catch (error) {
    throw new Error('Something went wrong reading the config file!');
  }
}

async function writeConfig(cfg: Config): Promise<void> {
  const filePath = getConfigFilePath();
  
  const json: JsonConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };

  const rawData = JSON.stringify(json, null, 2);
  await fs.writeFile(filePath, rawData, 'utf-8');
}

export async function setUser(userName: string): Promise<void> {
  const cfg = await readConfig();
  
  cfg.currentUserName = userName;
  await writeConfig(cfg);
}
