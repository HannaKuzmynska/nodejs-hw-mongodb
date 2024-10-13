import dotenv from 'dotenv';
dotenv.config();

import { initDBConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { loadInitialContacts } from './utils/loadInitialContacts.js';

async function start() {
  try {
    await initDBConnection();
    await loadInitialContacts(); 
    setupServer();
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

start();
