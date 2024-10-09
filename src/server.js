import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { getAllContacts, getContactById } from './controllers/contactsController.js';

const logger = pino();
const app = express();

app.use(cors());
app.use(express.json());

// Маршрути
app.get('/contacts', getAllContacts);
app.get('/contacts/:contactId', getContactById);

// Маршрут для неіснуючих маршрутів
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Функція для налаштування і запуску сервера
export const setupServer = () => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

// Запуск сервера
setupServer();
