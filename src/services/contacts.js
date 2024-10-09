import Contact from '../models/contact.js';

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
export const getContactById = async (id) => {
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

// Створити новий контакт
export const createNewContact = async (contactData) => {
  try {
    const contact = new Contact(contactData);
    await contact.save();
    return contact;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw new Error('Error creating contact');
  }
};

// Оновити контакт за ID
export const updateContactById = async (id, contactData) => {
  try {
    const contact = await Contact.findByIdAndUpdate(id, contactData, {
      new: true,
    });
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw new Error('Error updating contact');
  }
};

// Видалити контакт за ID
export const deleteContactById = async (id) => {
  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw new Error('Error deleting contact');
  }
};
