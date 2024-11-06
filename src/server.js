import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to the Contacts API');
});

// Підключення маршрутів
app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

// Обробка помилок
app.use(notFoundHandler);
app.use(errorHandler);

export const setupServer = () => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
