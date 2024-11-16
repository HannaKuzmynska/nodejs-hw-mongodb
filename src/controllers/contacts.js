import * as contactsService from '../services/contacts.js';
import createHttpError from 'http-errors';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

// Контролер для отримання всіх контактів
export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

    const filters = { userId: req.user._id };

    if (type) filters.contactType = type;
    if (isFavourite !== undefined) filters.isFavourite = isFavourite === 'true';

    const result = await contactsService.getAll(
      Number(page),
      Number(perPage),
      sortBy,
      sortOrder,
      filters
    );

    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Контролер для отримання контакту за ID
export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsService.getById(contactId, req.user._id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact found',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Контролер для створення нового контакту
export const createContact = async (req, res, next) => {
  try {
    const photo = req.file; // Отримуємо файл із запиту

    let photoUrl;

    // Перевіряємо, чи потрібно зберігати фото у Cloudinary
    if (photo) {
      if (env('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo); // Зберігаємо фото в Cloudinary
      } else {
        photoUrl = await saveFileToUploadDir(photo); // Зберігаємо фото в папку завантажень
      }
    }

    const newContact = await contactsService.create({
      ...req.body,
      userId: req.user._id,
      photoPath: photoUrl, // Додаємо шлях до збереженого фото
    });

    res.status(201).json({
      status: 'success',
      message: 'Contact successfully created',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// Контролер для оновлення контакту за ID
export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const photo = req.file; // Отримуємо файл із запиту

    let photoUrl;

    // Перевіряємо, чи потрібно зберігати фото у Cloudinary
    if (photo) {
      if (env('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo); // Зберігаємо фото в Cloudinary
      } else {
        photoUrl = await saveFileToUploadDir(photo); // Зберігаємо фото в папку завантажень
      }
    }

    const updatedContact = await contactsService.update(contactId, req.user._id, {
      ...req.body,
      photoPath: photoUrl, // Додаємо шлях до збереженого фото
    });

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact successfully updated',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// Контролер для видалення контакту за ID
export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await contactsService.remove(contactId, req.user._id);

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
