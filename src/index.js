import dotenv from 'dotenv';
dotenv.config(); 

import { initDBConnection } from './db/initMongoConnection.js';

async function start() {
  try {
    await initDBConnection();
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

start();

