import dotenv from 'dotenv';
dotenv.config();

import { initDBConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { loadInitialContacts } from './utils/loadInitialContacts.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  try {
    await initDBConnection();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
    await loadInitialContacts();
    setupServer();
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

void bootstrap();
