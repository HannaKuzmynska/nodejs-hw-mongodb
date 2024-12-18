import fs from 'fs/promises';

export const createDirIfNotExists = async (url) => {
  try {
    console.log(`Checking if directory exists at: ${url}`);
    await fs.access(url);  
    console.log('Directory exists.');
  } catch (err) {
    console.log('Directory does not exist, creating...');
    if (err.code === 'ENOENT') {
      await fs.mkdir(url, { recursive: true });
      console.log('Directory created.');
    }
  }
};
