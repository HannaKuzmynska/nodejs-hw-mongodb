import Contact from '../models/contact.js';

// Функція для отримання всіх контактів з фільтрацією, сортуванням і пагінацією
export const getAll = async (page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filters = {}) => {
  const skip = (page - 1) * perPage;

  const sortOrderValue = sortOrder === 'asc' ? 1 : -1;

  const query = Contact.find(filters)
    .sort({ [sortBy]: sortOrderValue })
    .skip(skip)
    .limit(perPage);

  const contacts = await query.exec();

  const totalItems = await Contact.countDocuments(filters);
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

// Функція для отримання контакту за його ID і userId
export const getById = async (id, userId) => {
  const contact = await Contact.findOne({ _id: id, userId });
  if (!contact) {
    throw new Error('Contact not found');
  }
  return contact;
};

// Функція для створення нового контакту
export const create = async (contactData) => {
  const newContact = new Contact(contactData);
  return await newContact.save();
};

// Функція для оновлення контакту за його ID і userId
export const update = async (id, userId, updatedData) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, userId },
    updatedData,
    { new: true }
  );

  if (!updatedContact) {
    throw new Error('Contact not found or not authorized to update');
  }

  return updatedContact;
};

// Функція для видалення контакту за його ID і userId
export const remove = async (id, userId) => {
  const deletedContact = await Contact.findOneAndDelete({ _id: id, userId });

  if (!deletedContact) {
    throw new Error('Contact not found or not authorized to delete');
  }

  return deletedContact;
};
