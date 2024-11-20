import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { env } from './utils/env.js';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

dotenv.config();
const PORT = Number(env('PORT', '3000'));

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Swagger API Documentation
app.use('/api-docs', swaggerDocs());

// Static file serving
app.use('/uploads', express.static(UPLOAD_DIR));

// Routes
app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

// Error handling
app.use('*', notFoundHandler);
app.use(errorHandler);

// Logging middleware (pino)
app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

export const setupServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
