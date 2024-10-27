import * as contactsService from '../services/contacts.js';

// Контролер для отримання всіх контактів
export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;
    const filters = {};

    if (type) filters.contactType = type;
    if (isFavourite !== undefined) filters.isFavourite = isFavourite === 'true';

    const result = await contactsService.getAll(
      Number(page),
      Number(perPage),
      sortBy,
      sortOrder,
      filters
    );

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Контролер для отримання контакту за ID
export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsService.getById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ contact });
  } catch (err) {
    next(err);
  }
};

// Контролер для створення нового контакту
export const createContact = async (req, res, next) => {
  try {
    const newContact = await contactsService.create(req.body);
    res.status(201).json({
      status: 201,
      message: 'Contact successfully created',
      data: newContact,
    });
  } catch (err) {
    next(err);
  }
};

// Контролер для оновлення контакту за ID
export const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const updatedContact = await contactsService.update(contactId, req.body);
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({
      status: 200,
      message: 'Contact successfully updated',
      data: updatedContact,
    });
  } catch (err) {
    next(err);
  }
};

// Контролер для видалення контакту за ID
export const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const deletedContact = await contactsService.remove(contactId);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(204).end(); 
  } catch (err) {
    next(err);
  }
};
