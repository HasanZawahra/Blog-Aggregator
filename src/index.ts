import { readConfig, setUser } from './config.js';

async function main() {
  try {
    await setUser('Hasan');

    const updatedConfig = await readConfig();
    console.log(updatedConfig);    
  }
  
  catch (error) {
    console.error('An error occurred during execution:', error);
  }
}

main();
