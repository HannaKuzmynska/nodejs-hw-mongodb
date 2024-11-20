import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { UPLOAD_DIR } from './constants/index.js';
import dotenv from 'dotenv';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

dotenv.config(); // Завантажує .env файл

const PORT = Number(env('PORT', '3000'));

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  })
);

app.use('/uploads', express.static(UPLOAD_DIR)); // Статичні файли для завантажених зображень
app.use('/api-docs', swaggerDocs()); // Swagger документація

app.get('/', (req, res) => {
  res.send('Welcome to the Contacts API');
});

app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

app.use('*', notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export const setupServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
