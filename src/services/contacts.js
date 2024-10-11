import { Contact } from '../models/contact.js';

// Отримати всі контакти
export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Could not fetch contacts');
  }
};

// Отримати контакт за ID
export const getContactByIdService = async (id) => {
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw new Error('Error fetching contact');
  }
};
