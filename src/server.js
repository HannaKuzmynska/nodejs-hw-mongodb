import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js'; // Додано імпорт для UPLOAD_DIR

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Додаємо статичний маршрут для доступу до файлів у папці "uploads"
app.use('/uploads', express.static(UPLOAD_DIR));

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
