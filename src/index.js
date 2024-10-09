import dotenv from 'dotenv';
dotenv.config();

import { initDBConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';  

async function start() {
  try {
    await initDBConnection();
    setupServer();
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

start();
