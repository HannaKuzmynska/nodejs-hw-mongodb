import Contact from '../models/contact.js'; // або імплементація класу, якщо ви використовуєте клас

export const getAll = async () => {
  // Логіка для отримання всіх контактів
  return await Contact.find(); // або інша логіка
};

export const getById = async (id) => {
  // Логіка для отримання контакту за ID
  return await Contact.findById(id); // або інша логіка
};

export const create = async (data) => {
  // Логіка для створення нового контакту
  const newContact = new Contact(data);
  return await newContact.save();
};

export const update = async (id, data) => {
  // Логіка для оновлення контакту
  return await Contact.findByIdAndUpdate(id, data, { new: true });
};

export const deleteContact = async (id) => {
  // Логіка для видалення контакту
  return await Contact.findByIdAndDelete(id);
};
