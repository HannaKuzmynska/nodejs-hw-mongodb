import Contact from '../models/contact.js';

// Функція для отримання всіх контактів з фільтрацією, сортуванням і пагінацією
export const getAll = async (page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filters = {}) => {
  const skip = (page - 1) * perPage;
  const query = Contact.find(filters)
    .sort({ [sortBy]: sortOrder })
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

// Функція для отримання контакту за його ID
export const getById = async (id) => {
  return await Contact.findById(id);
};

// Функція для створення нового контакту
export const create = async (contactData) => {
  const newContact = new Contact(contactData);
  return await newContact.save();
};

// Функція для оновлення контакту за його ID
export const update = async (id, updatedData) => {
  return await Contact.findByIdAndUpdate(id, updatedData, { new: true });
};

// Функція для видалення контакту за його ID
export const remove = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
