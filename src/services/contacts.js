import Contact from '../models/contact.js';

export const getAll = async (page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filters = {}) => {
  const skip = (page - 1) * perPage;

  if (filters.name) {
    filters.name = { $regex: filters.name, $options: 'i' };
  }

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

export const getById = async (id) => {
  return await Contact.findById(id);
};
