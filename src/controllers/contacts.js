import * as contactsService from '../services/contacts.js';
import createHttpError from 'http-errors';

// Контролер для отримання всіх контактів
export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

    // Фільтруємо контакти по userId (отримано після аутентифікації)
    const filters = { userId: req.user._id };

    if (type) filters.contactType = type;
    if (isFavourite !== undefined) filters.isFavourite = isFavourite === 'true';

    // Викликаємо сервіс для отримання контактів
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
    // Додаємо userId до контакту
    const newContact = await contactsService.create({ ...req.body, userId: req.user._id });

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
    const updatedContact = await contactsService.update(contactId, req.user._id, req.body);

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
